interface SocialSignUpButtonProps {
  text: string;
  provider: JSX.Element;
}

function SocialSign({ provider, text }: SocialSignUpButtonProps) {
  return (
    <button className="flex-1 border rounded-lg p-2 flex items-center justify-center">
      {provider}
      <span className="ml-2">{text}</span>
    </button>
  );
}

export default SocialSign;
