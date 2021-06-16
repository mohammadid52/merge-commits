import { UniversalLesson } from '../../../../interfaces/UniversalLessonInterfaces';

/**
 *
 * THIS DATA IS FETCHED AND GETS STORED IN
 *
 *        state.data.
 *
 */

export const exampleUniversalLesson: UniversalLesson = {
  id: '7ad8e2ce-2882-4d8c-9b03-383310a56482',
  summary:
    "This is a fun lesson where everyone is encouraged to be a part of the conversation about how our own cultures have influenced our sense of self-identity.  We start by writing about where we are from and share stories from these places.  Afterward, we will have the opportunity to see Marlon tell about how culture influenced his sense of self-identify through his poem 'Where I'm from.' Finally, we will create our own poems and learn more about each other and where we are from by sharing these poem...",
  designers: ['Marlon Lizama'],
  teachers: ['Marlon Lizama'],
  categories: ['Creative Writing'],
  universalLessonPlan: [
    { enabled: true, open: true, active: true, label: 'Introduction', displayMode: 'SELF' },
    { enabled: true, open: false, active: false, label: 'Story', displayMode: 'SELF' },
    { enabled: true, open: false, active: false, label: 'Outro', displayMode: 'SELF' },
  ],
  universalLessonPages: [
    {
      id: 'page_1',
      title: '',
      description: '',
      class: '',
      pageContent: [],
    },
    {
      id: 'page_2',
      title: 'Tales of Myth and Urban Legend',
      description: '',
      class: '',
      pageContent: [
        {
          id: 'page_2_part_0',
          tags: ['homework', 'story', 'school'],
          partType: 'default',
          class: 'bg-red-500 bg-opacity-40 rounded-lg',
          partContent: [
            {
              id: 'page_2_part_0_header-0',
              type: 'header-default',
              value: ['Instructions'] },
            {
              id: 'page_2_part_0_text-0',
              type: 'paragraph',
              value: [
                "Try to think of a story, supersition, or urban myth you've been told by a family member, friend, or loved one. Think about who told it to you, where the story comes from, and why the story is told.\n" +
                  '\n' +
                  'Then, fill in the spaces below describing this story, and, in the large space, write a few sentences summarizing the story.',
              ],
            },
          ],
        },
        {
          id: 'page_2_part_1',
          partType: 'default',
          class: 'rounded-lg',
          partContent: [
            {
              id: 'page_2_part_1_header-1',
              type: 'header-section',
              value: ['Myths Story Warmup'],
            },
            {
              id: 'page_2_part_1_questionGroup-1',
              type: 'form-default',
              value: [
                { id: 'title', type: 'text-input', label: 'Title', value: ['This is the placeholder'] },
                { id: 'story', type: 'text-area', label: '', value: ['This is the placeholder'] },
              ],
            },
          ],
        },
        {
          id: 'page_2_part_2',
          partType: 'default',
          class: 'rounded-lg',
          partContent: [
            {
              id: 'page_2_part_2_header-2',
              type: 'header-section',
              value: ['Focus Questions'],
            },
            {
              id: 'page_2_part_2_questionGroup-2',
              type: 'form-numbered',
              value: [
                {
                  id: 'culture',
                  type: 'text-input',
                  label: 'What culture does this story come from?',
                  value: ['Mexican etc.'],
                },
                {
                  id: 'storyteller',
                  type: 'text-input',
                  label: 'Who is the storyteller in your life?',
                  value: ['Grandma etc.'],
                },
                {
                  id: 'lessons',
                  type: 'text-input',
                  label: 'What lessons does this story teach us?',
                  value: ['Perseverance etc.'],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'page_3',
      title: '',
      description: '',
      class: '',
      pageContent: [],
    },
  ],
};
