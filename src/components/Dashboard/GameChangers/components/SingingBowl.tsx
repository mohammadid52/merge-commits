import Buttons from "@components/Atoms/Buttons";
import { CreateGameChangerLogInput, GameChangerLog } from "API";
import useAuth from "customHooks/useAuth";
import useGraphqlMutation from "customHooks/useGraphqlMutation";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { awsFormatDate, dateString } from "utilities/time";
import { SingingBowlSvg } from "../svg";

const BowlSvg = ({}: {}) => {
  return <SingingBowlSvg />;
};

const SingingBowl = () => {
  const audioControl = document.getElementById("singing-meditation");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      // @ts-ignore
      audioControl?.play();
    } else {
      // @ts-ignore
      audioControl?.pause();
    }
    return () => {
      // @ts-ignore
      audioControl?.pause();
    };
  }, [isPlaying]);

  const mutationLog = useGraphqlMutation<
    { input: CreateGameChangerLogInput },
    GameChangerLog
  >("createGameChangerLog");
  const { email, authId } = useAuth();

  const start = () => {
    const gameChangerID = nanoid(24);
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      mutationLog.mutate({
        input: {
          id: nanoid(24),
          gameChangerID,
          personAuthID: authId,
          personEmail: email,
          startTime: awsFormatDate(dateString("-", "WORLD")),
        },
      });
    }
  };

  return (
    <div>
      <audio id="singing-meditation">
        <source
          src="https://iconoclaststorage143306-dev.s3.amazonaws.com/public/528_Hz_Singing_bowl_sound_meditation_with_an_antique_Himalayan_Mani_bowl_33_minutes-AudioTrimmer.com.mp3"
          type="audio/mp3"
        />
      </audio>
      <BowlSvg />

      <Buttons
        btnClass="w-full"
        onClick={start}
        label={isPlaying ? "Stop Meditation" : "Start Meditation"}
      />
    </div>
  );
};

export default SingingBowl;
