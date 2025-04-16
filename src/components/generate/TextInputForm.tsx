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
    <Card>
      <CardHeader>
        <CardTitle>Enter Your Text</CardTitle>
        <CardDescription>
          Enter text between {MIN_LENGTH} and {MAX_LENGTH} characters to generate flashcards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Enter your text here..."
            value={value}
            onChange={handleChange}
            className="min-h-[200px] resize-y"
          />
          <div className="text-sm text-muted-foreground">
            {value.length < MIN_LENGTH && <span>Need {neededChars} more characters</span>}
            {value.length > MIN_LENGTH && value.length <= MAX_LENGTH && (
              <span>{remainingChars} characters remaining</span>
            )}
            {value.length > MAX_LENGTH && (
              <span className="text-destructive">{Math.abs(remainingChars)} characters over limit</span>
            )}
          </div>
        </div>
        <Button onClick={onGenerate} disabled={!isValidLength || isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Flashcards"}
        </Button>
      </CardContent>
    </Card>
  );
}
