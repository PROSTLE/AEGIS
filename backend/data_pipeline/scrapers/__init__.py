"""Data Pipeline Scrapers for AEGIS"""
from abc import ABC, abstractmethod

class BaseScraper(ABC):
    """Base class for all data scrapers"""

    @abstractmethod
    async def scrape(self):
        pass

    @abstractmethod
    async def validate(self):
        pass

class StartupIndiaScraper(BaseScraper):
    """Scraper for Startup India DPIIT data"""
    async def scrape(self):
        # TODO: Implement Startup India scraping
        pass

    async def validate(self):
        # TODO: Validate scraped data
        pass

class TracxnScraper(BaseScraper):
    """Scraper for Tracxn startup data"""
    async def scrape(self):
        # TODO: Implement Tracxn scraping
        pass

    async def validate(self):
        pass

class MCA21Scraper(BaseScraper):
    """Scraper for MCA21 company status data"""
    async def scrape(self):
        # TODO: Implement MCA21 scraping
        pass

    async def validate(self):
        pass

class GSTScraper(BaseScraper):
    """Scraper for GST filing data"""
    async def scrape(self):
        # TODO: Implement GST scraping
        pass

    async def validate(self):
        pass
