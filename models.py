from database import Base
from sqlalchemy import Column,String,Integer,ForeignKey,DateTime,Boolean

class Links(Base):
    __tablename__ = "links"
    
    link_id = Column(Integer, primary_key=True, index=True)
    original_link = Column(String, nullable=False)
    alias = Column(String, nullable=True ,unique=True)
    password_hash = Column(String, nullable=True)
    
