interface SubmitButtonProps {
  text: string;
}

function SubmitButton({ text }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="w-full bg-luxtix-6 text-luxtix-1 rounded-lg p-2 font-bold"
    >
      {text}
    </button>
  );
}

export default SubmitButton;
