export interface UserEmotion {
  client_id: string;
  emotion: emotion;
}
enum emotion {
  "neutral",
  "happy",
  "sad",
  "angry",
  "fearful",
  "disgusted",
  "surprised",
  undefined,
}
