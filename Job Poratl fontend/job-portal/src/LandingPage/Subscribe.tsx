import { Button, Textarea, TextInput } from "@mantine/core";

const Subscribe = () => {
  return (
    <div className="mt-20 mb-20 mx-atuo max-w-2xl bg-mine-shaft-900 rounded-2xl px-10 py-12 shadow-lg  backdrop-blur-lg bg-gradient-to-r from-white/20 via-cyan-200/20 border border-white/20  shadow-[0_0_30px_rgba(255,255,255,0.7)]">
      <div className="flex flex-col items-center gap-6">

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center">
          Never Want to Miss Any
          <span className="text-amber-500"> Job News?</span>
        </h2>

        <p className="text-gray-400 text-lg text-center max-w-2xl">
          Subscribe now and get the latest job updates, career tips, and exclusive
          opportunities delivered straight to your inbox.
        </p>

        {/* Form */}
        <div className="w-full max-w-xl flex flex-col gap-4 bg-mine-shaft-800 p-6 rounded-xl">

          {/* Name */}
          <TextInput
            variant="unstyled"
            size="lg"
            placeholder="Your name"
            className="
              bg-mine-shaft-700 px-4 py-3 rounded-lg
              [&_input]:text-white
              [&_input]:placeholder:text-gray-400
            "
          />

          {/* Email */}
          <TextInput
            variant="unstyled"
            size="lg"
            type="email"
            placeholder="Enter your email"
            className="
              bg-mine-shaft-700 px-4 py-3 rounded-lg
              [&_input]:text-white
              [&_input]:placeholder:text-gray-400
            "
          />

          {/* Comment */}
          <Textarea
            variant="unstyled"
            size="lg"
            minRows={3}
            placeholder="Leave a comment (optional)"
            className="
              bg-mine-shaft-700 px-4 py-3 rounded-lg
              [&_textarea]:text-white
              [&_textarea]:placeholder:text-gray-400
            "
          />

          {/* Button */}
          <Button
            size="lg"
            radius="lg"
            className="
              
              bg-gradient-to-r from-cyan-500 to-cyan-600 
              text-mine-shaft-900 font-semibold
              hover:shadow-[0_4px_12px_rgba(255,255,7,0.5)] transition-shadow duration-300 cursor-pointer hover:scale-105
            "
            variant="gradient"
            gradient={{ from: 'cyan', to: 'yellow', deg: 100 }}
          >
            Subscribe Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
