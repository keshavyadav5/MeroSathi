import { useState } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import mainLogo from "../../assets/logo.png";

const Loading = ({ isLoading }) => {
  const [color] = useState("green");

  return (
    <div className="flex items-center justify-center max-h-screen min-h-screen overflow-hidden">
      <div className="flex flex-col items-center">
        <img src={mainLogo} alt="Logo" className="h-14 w-50 mb-6" />
        <div className="sweet-loading">
          <CircleLoader
            color={color}
            loading={isLoading}
            size={80}
            cssOverride={{
              display: "block",
              margin: "0 auto",
              borderColor: "red",
            }}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
