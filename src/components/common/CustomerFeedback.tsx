
import React, { useState } from 'react';
import { MessageSquare, Send, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const CustomerFeedback: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    try {
      // In a real implementation, you'd send this to your backend
      console.log('Feedback submitted:', { feedback, rating, timestamp: new Date() });
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setFeedback('');
        setRating(0);
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="shadow-lg"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Feedback
        </Button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="fixed bottom-20 right-4 z-40 w-80">
        <Card className="shadow-xl border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-green-600 text-2xl mb-2">✓</div>
            <p className="text-sm text-green-800">Thank you for your feedback!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 w-80">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Quick Feedback</CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">
              How would you rate your experience?
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  <Star className="h-5 w-5 fill-current" />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-2">
              Tell us more (optional)
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What went well? What could be improved?"
              className="min-h-[80px] text-sm"
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full"
            size="sm"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerFeedback;
