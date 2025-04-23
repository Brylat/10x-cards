import { useCallback } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface TextInputFormProps {
  value: string;
  onChange: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const MIN_LENGTH = 1000;
const MAX_LENGTH = 10000;

export function TextInputForm({ value, onChange, onGenerate, isLoading }: TextInputFormProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const isValidLength = value.length >= MIN_LENGTH && value.length <= MAX_LENGTH;
  const remainingChars = MAX_LENGTH - value.length;
  const neededChars = MIN_LENGTH - value.length;

  return (
    <Card className="border border-gray-200 bg-white/5 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold text-gray-100">Enter Your Text</CardTitle>
        <CardDescription className="text-gray-300">
          Enter text between {MIN_LENGTH} and {MAX_LENGTH} characters to generate flashcards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-3">
          <Textarea
            placeholder="Enter your text here..."
            value={value}
            onChange={handleChange}
            className="min-h-[200px] resize-y bg-white/10 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500/20"
          />
          <div className="text-sm">
            {value.length < MIN_LENGTH && <span className="text-blue-300">Need {neededChars} more characters</span>}
            {value.length > MIN_LENGTH && value.length <= MAX_LENGTH && (
              <span className="text-green-300">{remainingChars} characters remaining</span>
            )}
            {value.length > MAX_LENGTH && (
              <span className="text-red-300">{Math.abs(remainingChars)} characters over limit</span>
            )}
          </div>
        </div>
        <Button
          onClick={onGenerate}
          disabled={!isValidLength || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Generating..." : "Generate Flashcards"}
        </Button>
      </CardContent>
    </Card>
  );
}
