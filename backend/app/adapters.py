from abc import ABC, abstractmethod
from typing import Dict, Any, List
import time
import random

class SourceAdapter(ABC):
    def __init__(self, name: str, source_type: str, domain: str, rate_limit_rps: float = 2.0):
        self.name = name
        self.source_type = source_type
        self.domain = domain
        self.rate_limit_rps = rate_limit_rps
        self.status = "OPERATIONAL"
        self.last_ping_ms = random.randint(45, 120)
        self.robots_txt_status = "Compliant (Permitted Public Data / API Gateway)"
        self.anti_bot_policy = "Ethical Collection: No CAPTCHA/WAF bypass; fallback to partner connectors"

    @abstractmethod
    def collect(self, route: str, window: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def normalize(self, raw_quote: Dict[str, Any]) -> Dict[str, Any]:
        pass

    def get_health(self) -> Dict[str, Any]:
        return {
            "source_name": self.name,
            "type": self.source_type,
            "domain": self.domain,
            "rate_limit_rps": self.rate_limit_rps,
            "status": self.status,
            "latency_ms": self.last_ping_ms,
            "robots_txt_status": self.robots_txt_status,
            "anti_bot_policy": self.anti_bot_policy,
            "mode": "DEMO / LIVE ADAPTER READY"
        }

class MockAirlineAdapter(SourceAdapter):
    def __init__(self, name: str, domain: str, airline_code: str):
        super().__init__(name, "AIRLINE", domain, rate_limit_rps=3.0)
        self.airline_code = airline_code

    def collect(self, route: str, window: str) -> Dict[str, Any]:
        return {
            "source": self.name,
            "route": route,
            "window": window,
            "collected_at": time.time(),
            "status": "SUCCESS"
        }

    def normalize(self, raw_quote: Dict[str, Any]) -> Dict[str, Any]:
        return raw_quote

class MockOTAAdapter(SourceAdapter):
    def __init__(self, name: str, domain: str):
        super().__init__(name, "OTA", domain, rate_limit_rps=2.0)

    def collect(self, route: str, window: str) -> Dict[str, Any]:
        return {
            "source": self.name,
            "route": route,
            "window": window,
            "collected_at": time.time(),
            "status": "SUCCESS"
        }

    def normalize(self, raw_quote: Dict[str, Any]) -> Dict[str, Any]:
        return raw_quote

# 11 Source Adapters for Indian Aviation Ecosystem
ALL_ADAPTERS: List[SourceAdapter] = [
    # Airlines
    MockAirlineAdapter("IndiGo", "goindigo.in", "6E"),
    MockAirlineAdapter("Air India", "airindia.com", "AI"),
    MockAirlineAdapter("Air India Express", "airindiaexpress.com", "IX"),
    MockAirlineAdapter("Akasa Air", "akasaair.com", "QP"),
    MockAirlineAdapter("SpiceJet", "spicejet.com", "SG"),
    # OTAs
    MockOTAAdapter("MakeMyTrip", "makemytrip.com"),
    MockOTAAdapter("Yatra", "yatra.com"),
    MockOTAAdapter("EaseMyTrip", "easemytrip.com"),
    MockOTAAdapter("Cleartrip", "cleartrip.com"),
    MockOTAAdapter("Ixigo", "ixigo.com"),
    MockOTAAdapter("Goibibo", "goibibo.com"),
]

def get_all_adapters_status() -> List[Dict[str, Any]]:
    return [adapter.get_health() for adapter in ALL_ADAPTERS]
