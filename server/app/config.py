from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///./student_platform_final.db"
    redis_url: str = "redis://localhost:6379/0"
    secret_key: str = "supersecretkey"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    debug: bool = True
    openai_api_key: str = "sk-proj-T1N_v7S18c9L7M2qR9P4v_l5O8u3S6jUAn5M7b1H4k9P2u4v_l5O8u3S6jUA" # Default from user request
    gemini_api_key: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
