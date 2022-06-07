export const Button = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
  },
) => {
  const variant = props.variant || "primary";
  return (
    <button
      {...props}
      className={`px-3 py-1 text-sm font-medium tracking-tight text-white rounded bg-gradient-to-br ${
        variant === "primary" && "from-blue-500 to-blue-600"
      } ${
        variant === "secondary" &&
        "from-gray-600 to-gray-700"
      }`}
    ></button>
  );
};
