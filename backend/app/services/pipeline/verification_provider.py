import logging
import torch
from abc import ABC, abstractmethod
from typing import Dict, List, Tuple
from transformers import AutoTokenizer, AutoModelForSequenceClassification

logger = logging.getLogger(__name__)

class VerificationProvider(ABC):
    """Abstraction for NLI evidence verification."""
    
    @abstractmethod
    def verify(self, claim: str, evidence: str) -> Dict[str, float]:
        """
        Takes a claim and an evidence string, and returns a dictionary of scores:
        {
            "entailment": float,
            "contradiction": float,
            "neutral": float
        }
        """
        pass

class NLIVerificationProvider(VerificationProvider):
    def __init__(self, model_name: str, device: str = None):
        self.model_name = model_name
        
        if not device:
            if torch.cuda.is_available():
                self.device = "cuda"
            else:
                self.device = "cpu"
        else:
            self.device = device
            
        logger.info(f"Loading NLI model {model_name} on {self.device}")
        
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.model.to(self.device)
        self.model.eval()
        
        # Build label mapping from model config
        self._label_map = {}
        for id, label in self.model.config.id2label.items():
            label_lower = label.lower()
            if "entail" in label_lower:
                self._label_map[id] = "entailment"
            elif "contradict" in label_lower:
                self._label_map[id] = "contradiction"
            else:
                self._label_map[id] = "neutral"
                
    def verify(self, claim: str, evidence: str) -> Dict[str, float]:
        """
        Scores the (evidence, claim) pair.
        Note: NLI models generally expect (premise, hypothesis) -> (evidence, claim).
        """
        # (premise, hypothesis)
        inputs = self.tokenizer(evidence, claim, return_tensors="pt", truncation=True)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probs = torch.softmax(logits, dim=-1)[0].tolist()
            
        result = {"entailment": 0.0, "contradiction": 0.0, "neutral": 0.0}
        for i, prob in enumerate(probs):
            mapped_label = self._label_map.get(i, "neutral")
            result[mapped_label] += prob
            
        return result
