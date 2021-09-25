interface LessonEditProps {
  designersList: any[];
}

export interface InstructionInitialState {
  introductionTitle: string;
  instructionsTitle: string;
  summaryTitle: string;
  introduction: string;
  instructions: string;
  summary: string;
}

export interface LessonPlansProps {
  type: string;
  LessonComponentID: string;
  sequence: number;
  stage: string;
}

export interface SavedLessonDetailsProps {
  lessonPlans: LessonPlansProps[] | null;
  lessonInstructions: InstructionInitialState | null;
}
