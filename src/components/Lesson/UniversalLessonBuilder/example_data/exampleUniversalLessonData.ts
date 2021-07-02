import {UniversalLesson} from '../../../../interfaces/UniversalLessonInterfaces';

/**
 *
 * THIS DATA IS FETCHED AND GETS STORED IN
 *
 *        state.data.
 *
 */

export const exampleUniversalLesson: UniversalLesson = {
  id: '2451e3be-1e12-486d-80dd-3e6fa24591cd',
  summary:
    "This is a fun lesson where everyone is encouraged to be a part of the conversation about how our own cultures have influenced our sense of self-identity.  We start by writing about where we are from and share stories from these places.  Afterward, we will have the opportunity to see Marlon tell about how culture influenced his sense of self-identify through his poem 'Where I'm from.' Finally, we will create our own poems and learn more about each other and where we are from by sharing these poem...",
  designers: ['Marlon Lizama'],
  teachers: ['Marlon Lizama'],
  categories: ['Creative Writing'],
  lessonPlan: [
    {
      enabled: true,
      open: true,
      active: true,
      id: 'page_1',
      label: 'Introduction',
      displayMode: 'SELF',
      title: 'Introduction',
      description: '',
      class: '',
      estTime: 15,
      pageContent: [
        {
          id: 'page_1_part_0',
          tags: [''],
          partType: 'default',
          class: 'rounded-lg',
          partContent: [
            {
              id: 'page_1_part_0_jumbotron-0',
              type: 'jumbotron',
              value: [
                {
                  id: 'background',
                  type: 'background',
                  label: 'Background',
                  value:
                    'https://images.freeimages.com/images/large-previews/d5d/powerlines-5-1389930.jpg',
                },
                {
                  id: 'title',
                  type: 'title',
                  label: 'Title',
                  value: 'Jumbo Title',
                },
                {
                  id: 'subtitle',
                  type: 'subtitle',
                  label: 'Subtitle',
                  value: 'This is the placeholder',
                },
                {
                  id: 'description',
                  type: 'description',
                  label: 'Description',
                  value: 'This is the description text',
                },
              ],
            },
            {
              id: 'page_1_part_1_keywords-0',
              type: 'keywords',
              value: [
                {
                  id: '',
                  type: '',
                  label: 'Keyword Title',
                  value: 'Keyword description',
                },
                {
                  id: '',
                  type: '',
                  label: 'Keyword Title',
                  value: 'Keyword description',
                },
                {
                  id: '',
                  type: '',
                  label: 'Keyword Title',
                  value: 'Keyword description',
                },
                {
                  id: '',
                  type: '',
                  label: 'Keyword Title',
                  value: 'Keyword description',
                },
              ],
            },
            {
              id: 'page_2_part_1_questionGroup-1',
              type: 'form-default',
              value: [
                {
                  id: 'title',
                  type: 'emoji-input',
                  label: 'Title',
                  value: 'This is the placeholder',
                },
                {
                  id: 'story',
                  type: 'emoji-input',
                  label: '',
                  value: 'This is the placeholder',
                },
              ],
            },
            {
              id: 'page_1_part_0_header-0',
              type: 'header',
              value: [{id: 'header_323', value: 'Introduction'}],
            },
            {
              id: 'page_1_part_0_text-0',
              type: 'paragraph',

              value: [{id: 'paragraph_454323', value: 'Just some instruction text'}],
            },
          ],
        },
      ],
    },
    {
      enabled: true,
      open: true,
      active: false,
      id: 'page_2',
      label: 'Story',
      displayMode: 'SELF',
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
              type: 'header',

              value: [{id: 'header_454323', value: 'Instructions'}],
            },
            {
              id: 'page_2_part_0_text-0',
              type: 'paragraph',
              value: [
                {
                  id: 'paragraph_5346',
                  value:
                    "Try to think of a story, supersition, or urban myth you've been told by a family member, friend, or loved one. Think about who told it to you, where the story comes from, and why the story is told.\n" +
                    '\n' +
                    'Then, fill in the spaces below describing this story, and, in the large space, write a few sentences summarizing the story.',
                },
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
              type: 'header',
              class: 'border-b-4 border-green-500',

              value: [{id: 'header_eq4543', value: 'Myths Story Warmup'}],
            },
            {
              id: 'page_2_part_1_questionGroup-1',
              type: 'form-default',
              value: [
                {
                  id: 'title',
                  type: 'text-input',
                  label: 'Title',
                  value: 'This is the placeholder',
                },
                {
                  id: 'story',
                  type: 'text-area',
                  label: '',
                  value: 'This is the placeholder',
                },
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
              type: 'header',
              class: 'border-b-4 border-green-500',
              value: [{id: 'header_4543', value: 'Focus Questions'}],
            },
            {
              id: 'page_2_part_2_questionGroup-2',
              type: 'form-numbered',
              value: [
                {
                  id: 'culture',
                  type: 'text-input',
                  label: 'What culture does this story come from?',
                  value: 'Mexican etc.',
                },
                {
                  id: 'storyteller',
                  type: 'text-input',
                  label: 'Who is the storyteller in your life?',
                  value: 'Grandma etc.',
                },
                {
                  id: 'lessons',
                  type: 'text-input',
                  label: 'What lessons does this story teach us?',
                  value: 'Perseverance etc.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      enabled: true,
      open: false,
      active: false,
      id: 'page_3',
      label: 'Activity',
      displayMode: 'SELF',
      title: 'Activity',
      description: '',
      class: '',
      pageContent: [
        {
          id: 'page_3_part_0',
          tags: [''],
          partType: 'default',
          class: 'rounded-lg',
          partContent: [
            {
              id: 'page_3_part_0_dropdown-0',
              type: 'poem',
              value: [
                {
                  id: 'line_1',
                  type: '',
                  label: '',
                  value: 'Poem line starter one',
                },
                {
                  id: 'line_2',
                  type: '',
                  label: '',
                  value: 'Poem line starter two',
                },
                {
                  id: 'line_3',
                  type: '',
                  label: '',
                  value: 'Poem line starter three',
                },
                {
                  id: 'line_4',
                  type: '',
                  label: '',
                  value: 'Poem line starter four',
                },
              ],
            },
          ],
        },
        {
          id: 'page_3_part_1',
          tags: [''],
          partType: 'default',
          class: 'rounded-lg',
          partContent: [
            {
              id: 'page_3_part_1_highlighter-0',
              type: 'highlighter',
              value: [
                {
                  id: 'highlighter_433374',
                  value:
                    '<p>No man is an island,</p>\\n<p>Entire of itself,</p>\\n<p>Every man is a piece of the continent,</p>\\n<p>A part of the main.</p>\\n<p>If a clod be washed away by the sea,</p>\\n<p>Europe is the less.</p>\\n<p>As well as if a promontory were.</p>\\n<p>As well as if a manor of thy friend’s</p>\\n<p>Or of thine own were:</p>\\n<p>Any man’s death diminishes me,</p>\\n<p>Because I am involved in mankind,</p>\\n<p>And therefore never send to know for whom the bell tolls;</p>\\n<p>It tolls for thee.</p>\\n',
                },
              ],
            },
          ],
        },
        {
          id: 'page_3_part_2',
          tags: [''],
          partType: 'default',
          class: 'rounded-lg',
          partContent: [
            {
              id: 'page_3_part_0_rating-0',
              type: 'form-rating',
              value: [
                {
                  id: '',
                  type: 'rating-star',
                  label: 'What did you think of this test lesson?',
                  value: '',
                },
              ],
            },
            {
              id: 'page_3_part_0_links-0',
              type: 'links',
              value: [
                {
                  id: 'link1',
                  type: '',
                  label: 'Link to Page',
                  value: 'https://www.google.com',
                },
                {
                  id: 'link2',
                  type: '',
                  label: 'Link to Page',
                  value: 'https://www.google.com',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
