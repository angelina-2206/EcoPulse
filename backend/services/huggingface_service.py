# Simplified version for local development without heavy AI dependencies
from typing import List, Dict, Any
import random

# Mock imports for development
try:
    from transformers import pipeline, AutoTokenizer, AutoModel
    from sentence_transformers import SentenceTransformer
    import torch
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False
    print("⚠️ AI libraries not available - using mock implementations")

class HuggingFaceService:
    def __init__(self):
        """Initialize HuggingFace models for text processing and recommendations"""
        
        if not AI_AVAILABLE:
            print("⚠️ Using mock AI implementations for demo")
            self.embedding_model = None
            self.text_generator = None
            self.sentiment_analyzer = None
            self.ner_pipeline = None
            return
        
        # Initialize models with error handling for MVP
        try:
            # Sentence transformer for embedding generation
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            print("✅ Sentence transformer loaded successfully")
        except Exception as e:
            print(f"⚠️ Warning: Could not load sentence transformer: {e}")
            self.embedding_model = None
        
        try:
            # Text generation pipeline for recommendations
            self.text_generator = pipeline(
                "text-generation",
                model="microsoft/DialoGPT-small",
                tokenizer="microsoft/DialoGPT-small",
                device=-1  # Use CPU for MVP
            )
            print("✅ Text generation model loaded successfully")
        except Exception as e:
            print(f"⚠️ Warning: Could not load text generator: {e}")
            self.text_generator = None
        
        try:
            # Sentiment analysis for bill processing
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                device=-1
            )
            print("✅ Sentiment analyzer loaded successfully")
        except Exception as e:
            print(f"⚠️ Warning: Could not load sentiment analyzer: {e}")
            self.sentiment_analyzer = None
        
        try:
            # Named Entity Recognition for bill text extraction
            self.ner_pipeline = pipeline(
                "ner",
                model="dbmdz/bert-large-cased-finetuned-conll03-english",
                device=-1,
                aggregation_strategy="simple"
            )
            print("✅ NER pipeline loaded successfully")
        except Exception as e:
            print(f"⚠️ Warning: Could not load NER pipeline: {e}")
            self.ner_pipeline = None
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for text using sentence transformers"""
        if not self.embedding_model:
            # Return mock embeddings for MVP
            return [[0.1] * 384 for _ in texts]
        
        try:
            embeddings = self.embedding_model.encode(texts)
            return embeddings.tolist()
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            return [[0.1] * 384 for _ in texts]
    
    def enhance_recommendations(self, business_profile: Dict[str, Any], base_recommendations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Enhance recommendations with AI-generated insights"""
        
        enhanced_recommendations = []
        
        for rec in base_recommendations:
            enhanced_rec = rec.copy()
            
            # Generate AI explanation
            explanation = self._generate_explanation(business_profile, rec)
            enhanced_rec["ai_explanation"] = explanation
            
            # Calculate implementation difficulty
            difficulty = self._assess_implementation_difficulty(business_profile, rec)
            enhanced_rec["implementation_difficulty"] = difficulty
            
            # Generate follow-up suggestions
            follow_ups = self._generate_follow_up_suggestions(rec)
            enhanced_rec["follow_up_suggestions"] = follow_ups
            
            enhanced_recommendations.append(enhanced_rec)
        
        return enhanced_recommendations
    
    def _generate_explanation(self, business_profile: Dict[str, Any], recommendation: Dict[str, Any]) -> str:
        """Generate AI explanation for why this recommendation is suitable"""
        
        industry = business_profile.get("industry", "business")
        size = business_profile.get("size", "small")
        
        # Template-based explanation with AI enhancement
        base_explanation = f"This recommendation is particularly suitable for {size} {industry} businesses because "
        
        # Add specific reasoning based on recommendation type
        if "energy" in recommendation.get("category", "").lower():
            base_explanation += f"energy costs typically represent 10-30% of operational expenses in the {industry} sector. "
        elif "waste" in recommendation.get("category", "").lower():
            base_explanation += f"waste reduction can significantly impact both costs and environmental compliance in {industry}. "
        elif "transport" in recommendation.get("category", "").lower():
            base_explanation += f"transportation efficiency is crucial for {industry} operations and customer satisfaction. "
        
        # Add size-specific reasoning
        if size == "micro":
            base_explanation += "The low implementation cost and quick payback period make this ideal for micro businesses with limited capital."
        elif size == "small":
            base_explanation += "This recommendation offers a good balance of investment and returns for small businesses looking to scale sustainably."
        elif size == "medium":
            base_explanation += "Medium enterprises can leverage this investment for significant operational improvements and competitive advantage."
        
        return base_explanation
    
    def _assess_implementation_difficulty(self, business_profile: Dict[str, Any], recommendation: Dict[str, Any]) -> str:
        """Assess implementation difficulty using AI insights"""
        
        cost = recommendation.get("implementation_cost", 0)
        time = recommendation.get("implementation_time", "")
        annual_revenue = business_profile.get("annual_revenue", 500000)
        
        # Cost-to-revenue ratio analysis
        cost_ratio = cost / annual_revenue if annual_revenue > 0 else 1
        
        if cost_ratio < 0.01 and "week" in time.lower():
            return "Very Easy"
        elif cost_ratio < 0.02 and ("week" in time.lower() or "month" in time.lower()):
            return "Easy"
        elif cost_ratio < 0.05:
            return "Moderate"
        elif cost_ratio < 0.1:
            return "Challenging"
        else:
            return "Complex"
    
    def _generate_follow_up_suggestions(self, recommendation: Dict[str, Any]) -> List[str]:
        """Generate follow-up suggestions using AI"""
        
        category = recommendation.get("category", "").lower()
        title = recommendation.get("title", "").lower()
        
        suggestions = []
        
        if "energy" in category:
            suggestions = [
                "Monitor energy usage monthly to track improvement",
                "Consider energy management software for optimization",
                "Explore utility rebate programs in your area",
                "Train staff on energy conservation practices"
            ]
        elif "waste" in category:
            suggestions = [
                "Set up waste tracking and measurement systems",
                "Partner with local recycling facilities",
                "Implement staff training on waste reduction",
                "Consider waste-to-energy opportunities"
            ]
        elif "transport" in category:
            suggestions = [
                "Optimize delivery routes using GPS tracking",
                "Consider fleet telematics for efficiency monitoring",
                "Explore partnerships for shared logistics",
                "Implement driver training programs"
            ]
        elif "solar" in title or "renewable" in category:
            suggestions = [
                "Get multiple quotes from certified installers",
                "Investigate local solar incentives and net metering",
                "Consider battery storage for energy independence",
                "Plan for system maintenance and monitoring"
            ]
        else:
            suggestions = [
                "Start with a pilot implementation",
                "Set up measurement and tracking systems",
                "Consider staff training and change management",
                "Plan for regular review and optimization"
            ]
        
        return suggestions[:3]  # Return top 3 suggestions
    
    def process_bill_text(self, extracted_text: str) -> Dict[str, Any]:
        """Process extracted bill text using NLP"""
        
        result = {
            "entities": [],
            "sentiment": "neutral",
            "confidence": 0.5,
            "key_phrases": []
        }
        
        # Named Entity Recognition
        if self.ner_pipeline:
            try:
                entities = self.ner_pipeline(extracted_text)
                result["entities"] = [
                    {
                        "text": entity["word"],
                        "label": entity["entity_group"],
                        "confidence": entity["score"]
                    }
                    for entity in entities
                ]
                print(f"✅ Extracted {len(entities)} entities from bill text")
            except Exception as e:
                print(f"Error in NER processing: {e}")
        
        # Sentiment Analysis (for overall bill processing confidence)
        if self.sentiment_analyzer:
            try:
                sentiment_result = self.sentiment_analyzer(extracted_text[:512])  # Limit text length
                result["sentiment"] = sentiment_result[0]["label"].lower()
                result["confidence"] = sentiment_result[0]["score"]
                print(f"✅ Bill text sentiment: {result['sentiment']} (confidence: {result['confidence']:.2f})")
            except Exception as e:
                print(f"Error in sentiment analysis: {e}")
        
        # Extract key phrases (simple keyword extraction)
        result["key_phrases"] = self._extract_key_phrases(extracted_text)
        
        return result
    
    def _extract_key_phrases(self, text: str) -> List[str]:
        """Extract key phrases from text using simple pattern matching"""
        
        import re
        
        # Common energy bill keywords
        energy_keywords = [
            r'\d+\.?\d*\s*kwh',
            r'\d+\.?\d*\s*kilowatt.?hours?',
            r'billing\s+period',
            r'service\s+period',
            r'meter\s+reading',
            r'previous\s+reading',
            r'current\s+reading',
            r'usage\s+charges',
            r'delivery\s+charges',
            r'demand\s+charges'
        ]
        
        key_phrases = []
        text_lower = text.lower()
        
        for pattern in energy_keywords:
            matches = re.findall(pattern, text_lower)
            key_phrases.extend(matches)
        
        return list(set(key_phrases))[:10]  # Return unique phrases, max 10
    
    def generate_personalized_message(self, business_profile: Dict[str, Any], action_plan: Dict[str, Any]) -> str:
        """Generate a personalized message for the business"""
        
        name = business_profile.get("name", "Your Business")
        industry = business_profile.get("industry", "business")
        potential_savings = action_plan.get("total_potential_savings", 0)
        co2_reduction = action_plan.get("total_potential_co2_reduction", 0)
        
        message = f"""
Dear {name} Team,

Based on our AI analysis of your {industry} operations, we've identified significant opportunities for sustainability improvements:

💰 **Potential Annual Savings**: ${potential_savings:,.0f}
🌍 **CO₂ Reduction Potential**: {co2_reduction:.1f} tons per year

Our AI-powered recommendations are specifically tailored to your business size, industry, and operational patterns. Each suggestion includes detailed implementation guidance, cost-benefit analysis, and follow-up actions.

Key benefits of implementing our recommendations:
• Reduce operational costs and improve profitability
• Enhance your environmental impact and sustainability credentials
• Access valuable government subsidies and incentives
• Improve operational efficiency and competitiveness

We recommend starting with the highest-priority, lowest-cost implementations and gradually scaling up your sustainability initiatives.

Best regards,
The EcoPulse AI Advisory Team
        """
        
        return message.strip()

# Initialize global service instance
huggingface_service = HuggingFaceService()