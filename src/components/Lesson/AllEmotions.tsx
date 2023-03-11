import Loader from "atoms/Loader";
import { useGlobalContext } from "contexts/GlobalContext";
import useAuth from "customHooks/useAuth";
import useGraphqlQuery from "customHooks/useGraphqlQuery";
import { FeelingsArchive, ListFeelingsArchivesQueryVariables } from "API";
import moment from "moment";
import { nanoid } from "nanoid";
import React from "react";
import { useRouteMatch } from "react-router";
import TableBlock from "./UniversalLessonBlockComponents/Blocks/TableBlock";

const emotionData = {
  happy: {
    emoji: "😃",
    list: [
      "playful",
      "content",
      "accepted",
      "joyful",
      "free",
      "aroused",
      "optimistic",
      "cheeky",
      "proud",
      "loving",
      "interested",
      "thankful",
      "successful",
      "powerful",
      "trusting",
      "curious",
      "inquisitve",
      "intimate",
      "confident",
      "valued",
      "courageous",
      "sensitive",
      "inspired",
      "hopeful",
      "peaceful",
      "respected",
    ],
  },
  angry: {
    emoji: "😡",
    list: [
      "let down",
      "furious",
      "annoyed",
      "betrayed",
      "jealous",
      "bitter",
      "humiliated",
      "mad",
      "provoked",
      "numb",
      "disrespected",
      "dismissive",
      "frustrated",
      "aggressive",
      "indignant",
      "skeptical",
      "distant",
      "resentful",
      "withdrawn",
      "ridiculed",
      "infuriated",
      "hostile",
      "violated",
      "critical",
    ],
  },

  surprised: {
    emoji: "😱",
    list: [
      "startled",
      "confused",
      "dismayed",
      "amazed",
      "eager",
      "excited",
      "perplexed",
      "awe",
      "shocked",
      "disillusioned",
      "energetic",
      "astonished",
    ],
  },
  disgusted: {
    emoji: "🤢",
    list: [
      "disapproving",
      "repelled",
      "appalled",
      "hesitant",
      "awful",
      "disappointed",
      "horrified",
      "revolted",
      "humiliated",
      "judgemental",
      "nauseated",
      "detestable",
      "horrified",
    ],
  },
  sad: {
    emoji: "😔",
    list: [
      "lonely",
      "despair",
      "isolated",
      "hurt",
      "vulnerable",
      "fragile",
      "disappointed",
      "ashamed",
      "depressed",
      "embarrased",
      "guilty",
      "unimportant",
      "powerless",
      "grief",
      "abandoned",
      "empty",
      "vitimized",
      "remorseful",
    ],
  },
  fearful: {
    emoji: "😰",
    list: [
      "scared",
      "anxious",
      "insecure",
      "distraught",
      "helpless",
      "frightened",
      "rejected",
      "persecuted",
      "excluded",
      "inadequate",
      "inferior",
      "threatened",
      "nervous",
      "insignificant",
      "worried",
      "worthless",
      "exposed",
      "weak",
    ],
  },

  bad: {
    emoji: "😩",
    list: [
      "bored",
      "tired",
      "pressured",
      "apathetic",
      "stressed",
      "indifferent",
      "rushed",
      "busy",
      "overwhelmed",
      "unfocused",
      "out of control",
      "sleepy",
    ],
  },
};

const AllEmotions = () => {
  const { authId, isStudent } = useAuth();

  const router: any = useRouteMatch();

  const lessonId = router.params.lessonID || "999";

  const { data = [], isLoading } = useGraphqlQuery<
    ListFeelingsArchivesQueryVariables,
    FeelingsArchive[]
  >(
    "listFeelingsArchives",
    {
      filter: { personAuthID: { eq: authId }, lessonID: { eq: lessonId } },
    },
    { custom: true }
  );

  const {
    state: {
      lessonPage: { theme: lessonPageTheme = "dark", themeTextColor = "" } = {},
    },
    lessonState,
  } = useGlobalContext();

  const PAGES = isStudent ? lessonState?.lessonData?.lessonPlan : null;

  const pageColumn = {
    id: nanoid(24),
    value: "Page",
    options: data.map((em) => {
      const pageId: number = 0;
      // Number(em.sentimentType) >= 0 ? Number(em.sentimentType) : null;

      const text =
        pageId !== null
          ? !em?.lesson || isStudent
            ? PAGES[pageId].title
            : em?.lesson?.lessonPlan?.[pageId]?.label
          : "unknown";
      return {
        id: nanoid(24),
        text,
      };
    }),
  };

  const _keys = Object.keys(emotionData);

  function addEmojiToName(names: string[]) {
    return names.map((name, idx) =>
      _keys
        .map((n) => {
          // @ts-ignore
          if (emotionData[n].list.includes(name)) {
            // @ts-ignore
            return `${emotionData[n].emoji}${name}${
              idx !== names.length - 1 ? ", " : ""
            }`;
          }
          return null;
        })
        .filter(Boolean)
    );
  }

  const nameColumn = {
    id: nanoid(24),
    value: "Emotion Name",
    options: data.map((em) => {
      return {
        id: nanoid(24),
        text:
          em?.sentimentName && em?.sentimentName?.length > 0
            ? addEmojiToName(em.sentimentName)
            : "",
      };
    }),
  };

  const timeColumn = {
    id: nanoid(24),
    value: "Time",
    options: data.map((em) => ({
      id: nanoid(24),
      text: moment(em.createdAt).format("ll LT"),
    })),
  };

  const themePlaceholderColor =
    lessonPageTheme === "light" ? "placeholder-gray-800" : "text-gray-400";

  return data && data.length > 0 ? (
    <div
      className={`w-full py-2 px-4  ${themeTextColor} mt-2 rounded-xl bg-component-dark border-0 border-gray-700  ${themePlaceholderColor}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader color="#fff" />
        </div>
      ) : (
        <TableBlock
          classString="blue-500 || white || dark"
          value={[pageColumn, nameColumn, timeColumn]}
        />
      )}
    </div>
  ) : (
    <div className="hidden w-auto" />
  );
};

export default AllEmotions;
