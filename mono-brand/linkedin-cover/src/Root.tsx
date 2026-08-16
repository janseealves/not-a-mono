import React from "react";
import { Composition } from "remotion";
import { LinkedInCover } from "./Cover";
import { GmailSignature } from "./Signature";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LinkedInCover"
        component={LinkedInCover}
        width={1584}
        height={396}
        fps={30}
        durationInFrames={1}
      />
      <Composition
        id="GmailSignature"
        component={GmailSignature}
        width={480}
        height={140}
        fps={30}
        durationInFrames={1}
      />
    </>
  );
};
