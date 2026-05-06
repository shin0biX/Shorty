from fastapi import APIRouter,Depends,HTTPException,Request,BackgroundTasks
from pydantic import BaseModel,HttpUrl
from database import SessionLocal
from sqlalchemy.orm import Session
from typing import Annotated,Optional
from models import Links
from fastapi.responses import RedirectResponse
import redis
import requests
import hashlib
from user_agents import parse

# Added socket timeouts so if Redis is offline, it fails instantly instead of hanging
r = redis.Redis(host="localhost" , port=6379 , db=0, decode_responses=True, socket_connect_timeout=0.2, socket_timeout=0.2)


DOMAIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
CHAR_MAP = {char: i for i, char in enumerate(DOMAIN)}

def encode_base62(id:int) -> str:
    temp = id
    result = []
    while temp>0:
        if temp == 0:
            return DOMAIN[0]
        digit = temp %62
        result.append(DOMAIN[digit])
        temp = temp //62
    
    return "".join(reversed(result))  

def decode_base62(to_decode:str) -> int:
    temp = to_decode
    num=0
    for char in temp:
        num = num*62+ CHAR_MAP[char]
    return num

def record_analytics(short_code: str, ip: str, user_agent_string: str):
    try:
        ua = parse(user_agent_string)
        os_family = ua.os.family
        browser_family = ua.browser.family
        device_family = "Mobile" if ua.is_mobile else "Tablet" if ua.is_tablet else "PC"
        
        country = "Unknown"
        try:
            if ip and ip != "127.0.0.1" and not ip.startswith("192.168"):
                res = requests.get(f"http://ip-api.com/json/{ip}", timeout=2)
                if res.status_code == 200:
                    data = res.json()
                    country = data.get("country", "Unknown")
            else:
                country = "Localhost"
        except:
            pass

        r.hincrby(f"os:{short_code}", os_family, 1)
        r.hincrby(f"browser:{short_code}", browser_family, 1)
        r.hincrby(f"device:{short_code}", device_family, 1)
        r.hincrby(f"country:{short_code}", country, 1)
    except Exception as e:
        print(f"Analytics background task error: {e}")

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]

class CreateLinkRequest(BaseModel):
    original_link:HttpUrl
    alias: Optional[str] = None
    password: Optional[str] = None
    
    
@router.post("/shorten-link")
async def shorten_link(request:CreateLinkRequest, db:db_dependency):
    
    original_link = str(request.original_link)
    
    if not request.alias and not request.password:
        existing = db.query(Links).filter(
            Links.original_link == original_link,
            Links.password_hash == None
        ).first()

        if existing:
            short_code = existing.alias or encode_base62(existing.link_id)
            return {
                "short_url": f"https://shorty.ujjawalcodes.site/{short_code}"
            }
    
    if request.alias:
        existing_alias = db.query(Links).filter(Links.alias == request.alias).first()
        if existing_alias:
            raise HTTPException(status_code=400, detail="Alias already taken")
    
            
    pwd_hash = hashlib.sha256(request.password.encode()).hexdigest() if request.password else None

    new_link = Links(
        original_link = original_link,
        alias = request.alias,
        password_hash = pwd_hash
    )
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    
    short_code = new_link.alias or encode_base62(new_link.link_id)
    
    return {
        "short_url" : f"https://shorty.ujjawalcodes.site/{short_code}"
    }


@router.get("/{short_code}")
async def redirect_to_original(short_code:str , db:db_dependency, request:Request, background_tasks: BackgroundTasks):
    
    cached_key = f"url:{short_code}"
    click_key = f"clicks:{short_code}"
    rate_key = f"rate:{request.headers.get('x-forwarded-for', request.client.host)}"
    
    try:
        count = r.incr(rate_key)
        if count ==1:
            r.expire(rate_key,60)
        if count>5:
            raise HTTPException(status_code=429, detail="Too many requests")
    except Exception:
        pass
    
    try:
        cached_url = r.get(cached_key)
    except Exception:
        cached_url=None
        
    if cached_url:
        if cached_url == "PROTECTED":
            return RedirectResponse(f"https://shorty.ujjawalcodes.site/unlock/{short_code}")
        try:
            r.incr(click_key)
        except Exception:
            pass
        return RedirectResponse(cached_url)
    
    link = db.query(Links).filter(Links.alias == short_code).first()
    
    if not link:
        try:
            link_id = decode_base62(short_code)
        except:
            raise HTTPException(400, "Invalid short code")
        
        link = db.get(Links, link_id)
    
    
    if not link:
        raise HTTPException(404,"URL not found")
        
    if link.password_hash:
        try:
            r.set(cached_key, "PROTECTED", ex=3600)
        except:
            pass
        return RedirectResponse(f"https://shorty.ujjawalcodes.site/unlock/{short_code}")
        
    try:
        r.set(cached_key,link.original_link,ex=3600)
    except:
        pass
    
    try:
        r.incr(click_key)
    except Exception:
        pass

    ip = request.headers.get('x-forwarded-for', request.client.host)
    user_agent = request.headers.get('user-agent', '')
    background_tasks.add_task(record_analytics, short_code, ip, user_agent)

    return RedirectResponse(link.original_link,status_code=302)

class UnlockRequest(BaseModel):
    password: str

@router.post("/unlock/{short_code}")
async def unlock_link(short_code: str, req: UnlockRequest, db: db_dependency, request: Request, background_tasks: BackgroundTasks):
    link = db.query(Links).filter(Links.alias == short_code).first()
    if not link:
        try:
            link_id = decode_base62(short_code)
            link = db.get(Links, link_id)
        except:
            pass
            
    if not link or not link.password_hash:
        raise HTTPException(404, "URL not found or not protected")
        
    if hashlib.sha256(req.password.encode()).hexdigest() != link.password_hash:
        raise HTTPException(401, "Incorrect password")
        
    # Track analytics on successful unlock
    click_key = f"clicks:{short_code}"
    try:
        r.incr(click_key)
    except:
        pass
        
    ip = request.headers.get('x-forwarded-for', request.client.host)
    user_agent = request.headers.get('user-agent', '')
    background_tasks.add_task(record_analytics, short_code, ip, user_agent)

    return {"original_url": link.original_link}

@router.get("/analytics/{short_code}")
async def get_analytics(short_code: str, db: db_dependency):

    click_key = f"clicks:{short_code}"

    link = db.query(Links).filter(Links.alias == short_code).first()

    if not link:
        try:
            link_id = decode_base62(short_code)
            link = db.get(Links, link_id)
        except ValueError:
            raise HTTPException(400, "Invalid short code")

    if not link:
        raise HTTPException(404, "URL not found")

    try:
        clicks = r.get(click_key)
        os_data = r.hgetall(f"os:{short_code}")
        browser_data = r.hgetall(f"browser:{short_code}")
        device_data = r.hgetall(f"device:{short_code}")
        country_data = r.hgetall(f"country:{short_code}")
    except Exception:
        clicks = 0
        os_data = browser_data = device_data = country_data = {}

    return {
        "short_code": short_code,
        "original_url": link.original_link,
        "clicks": int(clicks) if clicks else 0,
        "os": {k: int(v) for k, v in os_data.items()},
        "browsers": {k: int(v) for k, v in browser_data.items()},
        "devices": {k: int(v) for k, v in device_data.items()},
        "countries": {k: int(v) for k, v in country_data.items()}
    }
    