import { Audiobook } from '../src/types';

export const AUDIOBOOKS_DATA: Audiobook[] = [
  {
    id: 'gatsby',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    narrator: 'Julian Vance',
    category: 'Classics',
    rating: 4.8,
    ratingCount: 3420,
    totalDurationSeconds: 1240,
    releaseYear: 1925,
    description: 'A dazzling tale of wealth, obsession, and the elusive American Dream set during the roaring jazz age of Long Island.',
    coverGradient: {
      from: '#0b192c',
      via: '#1e3e62',
      to: '#000000',
      accent: '#f59e0b',
      textColor: '#fef08a'
    },
    chapters: [
      {
        id: 'gatsby-1',
        chapterIndex: 1,
        title: 'Chapter 1: In My Younger and More Vulnerable Years',
        durationSeconds: 310,
        transcript: 'In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since. "Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven’t had the advantages that you’ve had." He didn’t say any more, but we’ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I’m inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.'
      },
      {
        id: 'gatsby-2',
        chapterIndex: 2,
        title: 'Chapter 2: The Valley of Ashes',
        durationSeconds: 295,
        transcript: 'About half way between West Egg and New York the motor road hastily joins the railroad and runs beside it for a quarter of a mile, so as to shrink away from a certain desolate area of land. This is a valley of ashes—a fantastic farm where ashes grow like wheat into ridges and hills and grotesque gardens; where ashes take the forms of houses and chimneys and rising smoke and, finally, with a transcendent effort, of men who move dimly and already crumbling through the powdery air.'
      },
      {
        id: 'gatsby-3',
        chapterIndex: 3,
        title: 'Chapter 3: The Summer Parties',
        durationSeconds: 320,
        transcript: 'There was music from my neighbor’s house through the summer nights. In his blue gardens men and girls came and went like moths among the whisperings and the champagne and the stars. At high tide in the afternoon I watched his guests diving from the tower of his raft, or taking the sun on the hot sand of his beach while his two motor-boats slit the waters of the Sound.'
      },
      {
        id: 'gatsby-4',
        chapterIndex: 4,
        title: 'Chapter 4: The Green Light across the Bay',
        durationSeconds: 315,
        transcript: 'He looked at her the way all women want to be looked at by a man. He stretched out his arms toward the dark water in a curious way, and, far as I was from him, I could have sworn he was trembling. Involuntarily I glanced seaward—and distinguished nothing except a single green light, minute and far away, that might have been the end of a dock.'
      }
    ]
  },
  {
    id: 'sherlock-holmes',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    narrator: 'David Sterling',
    category: 'Mystery',
    rating: 4.9,
    ratingCount: 4890,
    totalDurationSeconds: 1380,
    releaseYear: 1892,
    description: 'Follow the world’s most famous consulting detective, Sherlock Holmes, and Dr. John Watson through the fog-shrouded streets of Victorian London.',
    coverGradient: {
      from: '#2e1065',
      via: '#1e1b4b',
      to: '#0f172a',
      accent: '#c084fc',
      textColor: '#f3e8ff'
    },
    chapters: [
      {
        id: 'sherlock-1',
        chapterIndex: 1,
        title: 'Chapter 1: A Scandal in Bohemia',
        durationSeconds: 350,
        transcript: 'To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name. In his eyes she obscures and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind. He was, I take it, the most perfect reasoning and observing machine that the world has seen.'
      },
      {
        id: 'sherlock-2',
        chapterIndex: 2,
        title: 'Chapter 2: The Red-Headed League',
        durationSeconds: 340,
        transcript: 'I had called upon my friend, Mr. Sherlock Holmes, one day in the autumn of last year and found him in deep conversation with a very stout, florid-faced, elderly gentleman with fiery red hair. Holmes was seated in his armchair with his feet propped up, puffing slowly on his Persian pipe with an expression of quiet contemplation.'
      },
      {
        id: 'sherlock-3',
        chapterIndex: 3,
        title: 'Chapter 3: The Boscombe Valley Mystery',
        durationSeconds: 345,
        transcript: 'We were seated at breakfast one morning, my wife and I, when the maid brought in a telegram. It was from Sherlock Holmes and ran in this way: "Have you a couple of days to spare? Have just been wired for from the west of England in connection with Boscombe Valley tragedy. Shall be esteemed if you will come with me. Air and scenery perfect. Leave Paddington by the 11:15."'
      },
      {
        id: 'sherlock-4',
        chapterIndex: 4,
        title: 'Chapter 4: The Five Orange Pips',
        durationSeconds: 345,
        transcript: 'When I glance over my notes and records of the Sherlock Holmes cases between the years ’82 and ’90, there are many which present strange and interesting features, but none which struck a deeper chill into my soul than the singular affair of John Openshaw and the envelope containing the five dried orange pips.'
      }
    ]
  },
  {
    id: 'pride-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    narrator: 'Eleanor Hawthorne',
    category: 'Classics',
    rating: 4.9,
    ratingCount: 5120,
    totalDurationSeconds: 1260,
    releaseYear: 1813,
    description: 'A brilliant comedy of manners tracking Elizabeth Bennet and the proud Mr. Darcy through sparkling wit, societal tension, and unexpected romance.',
    coverGradient: {
      from: '#451a03',
      via: '#78350f',
      to: '#1c1917',
      accent: '#fbbf24',
      textColor: '#fef3c7'
    },
    chapters: [
      {
        id: 'pride-1',
        chapterIndex: 1,
        title: 'Chapter 1: It is a Truth Universally Acknowledged',
        durationSeconds: 310,
        transcript: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.'
      },
      {
        id: 'pride-2',
        chapterIndex: 2,
        title: 'Chapter 2: Mr. Bennet’s Visit',
        durationSeconds: 310,
        transcript: 'Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it. It was then disclosed in the following manner.'
      },
      {
        id: 'pride-3',
        chapterIndex: 3,
        title: 'Chapter 3: The Assembly Room Ball at Meryton',
        durationSeconds: 320,
        transcript: 'Not all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject, was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways—with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all.'
      },
      {
        id: 'pride-4',
        chapterIndex: 4,
        title: 'Chapter 4: Jane and Elizabeth Confide',
        durationSeconds: 320,
        transcript: 'When Jane and Elizabeth were alone, the former, who had been cautious in her praise before, expressed to her sister how very much she admired him. "He is just what a young man ought to be," said she, "sensible, good-humoured, lively; and I never saw such happy manners!"'
      }
    ]
  },
  {
    id: 'frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    narrator: 'Christopher Ward',
    category: 'Horror',
    rating: 4.7,
    ratingCount: 2980,
    totalDurationSeconds: 1300,
    releaseYear: 1818,
    description: 'The pioneering gothic masterpiece exploring ambition, scientific hubris, and the existential torment of Victor Frankenstein and his abandoned creation.',
    coverGradient: {
      from: '#064e3b',
      via: '#065f46',
      to: '#022c22',
      accent: '#34d399',
      textColor: '#d1fae5'
    },
    chapters: [
      {
        id: 'frank-1',
        chapterIndex: 1,
        title: 'Chapter 1: Walton’s Arctic Expedition',
        durationSeconds: 320,
        transcript: 'You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.'
      },
      {
        id: 'frank-2',
        chapterIndex: 2,
        title: 'Chapter 2: The Spark of Being',
        durationSeconds: 330,
        transcript: 'It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet. It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out.'
      },
      {
        id: 'frank-3',
        chapterIndex: 3,
        title: 'Chapter 3: The Monster Awakens',
        durationSeconds: 325,
        transcript: 'By the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs. How can I describe my emotions at this catastrophe, or how delineate the wretch whom with such infinite pains and care I had endeavoured to form?'
      },
      {
        id: 'frank-4',
        chapterIndex: 4,
        title: 'Chapter 4: The Creature Confronts His Maker',
        durationSeconds: 325,
        transcript: 'I expected this reception, said the daemon. All men hate the wretched; how, then, must I be hated, who am miserable beyond all living things! Yet you, my creator, detest and spurn me, thy creature, to whom thou art bound by ties only dissoluble by the annihilation of one of us.'
      }
    ]
  },
  {
    id: 'art-of-war',
    title: 'The Art of War',
    author: 'Sun Tzu',
    narrator: 'Master Kenji Sato',
    category: 'Philosophy',
    rating: 4.8,
    ratingCount: 6200,
    totalDurationSeconds: 1180,
    releaseYear: -500,
    description: 'The definitive ancient treatise on military strategy, leadership, discipline, diplomacy, and the psychology of conflict.',
    coverGradient: {
      from: '#7f1d1d',
      via: '#991b1b',
      to: '#450a0a',
      accent: '#f87171',
      textColor: '#fee2e2'
    },
    chapters: [
      {
        id: 'art-1',
        chapterIndex: 1,
        title: 'Chapter 1: Laying Plans',
        durationSeconds: 290,
        transcript: 'Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected. The art of war, then, is governed by five constant factors, to be taken into account in one’s deliberations, when seeking to determine the conditions obtaining in the field.'
      },
      {
        id: 'art-2',
        chapterIndex: 2,
        title: 'Chapter 2: Waging War',
        durationSeconds: 290,
        transcript: 'In the operations of war, where there are in the field a thousand swift chariots, as many heavy chariots, and a hundred thousand mail-clad soldiers, with provisions enough to carry them a thousand li, the expenditure at home and at the front will reach the total of a thousand ounces of silver per day.'
      },
      {
        id: 'art-3',
        chapterIndex: 3,
        title: 'Chapter 3: Attack by Stratagem',
        durationSeconds: 300,
        transcript: 'In the practical art of war, the best thing of all is to take the enemy’s country whole and intact; to shatter and destroy it is not so good. Hence that supreme art of war is to subdue the enemy without fighting. Thus the highest form of generalship is to balk the enemy’s plans; the next best is to prevent the junction of the enemy’s forces.'
      },
      {
        id: 'art-4',
        chapterIndex: 4,
        title: 'Chapter 4: Tactical Dispositions',
        durationSeconds: 300,
        transcript: 'The good fighters of old first put themselves beyond the possibility of defeat, and then waited for an opportunity of defeating the enemy. To secure ourselves against defeat lies in our own hands, but the opportunity of defeating the enemy is provided by the enemy himself.'
      }
    ]
  },
  {
    id: 'odyssey',
    title: 'The Odyssey',
    author: 'Homer',
    narrator: 'Demetrius Sterling',
    category: 'Adventure',
    rating: 4.8,
    ratingCount: 3840,
    totalDurationSeconds: 1420,
    releaseYear: -800,
    description: 'The grand mythological voyage of Odysseus navigating monsters, enchantresses, and divine wrath to return home to Ithaca.',
    coverGradient: {
      from: '#1e3a5f',
      via: '#0f766e',
      to: '#042f2e',
      accent: '#2dd4bf',
      textColor: '#ccfbf1'
    },
    chapters: [
      {
        id: 'odyssey-1',
        chapterIndex: 1,
        title: 'Chapter 1: Tell Me, O Muse',
        durationSeconds: 350,
        transcript: 'Sing in me, Muse, and through me tell the story of that man skilled in all ways of contending, the wanderer, harried for years on end, after he plundered the stronghold on the proud height of Troy. He saw the towns of many men and learned their minds, and many pains he suffered in the sea, longing to save his life and bring his comrades home.'
      },
      {
        id: 'odyssey-2',
        chapterIndex: 2,
        title: 'Chapter 2: The Lotus Eaters',
        durationSeconds: 350,
        transcript: 'Thence for nine days were we driven by ruinous winds over the teeming deep; but on the tenth we set foot on the land of the Lotus-eaters, who eat a floral food. There we stepped onto the dry land and drew water, and forthwith my shipmates took their meal by the swift ships.'
      },
      {
        id: 'odyssey-3',
        chapterIndex: 3,
        title: 'Chapter 3: In the Cave of Polyphemus',
        durationSeconds: 360,
        transcript: 'We entered the cave, but the Cyclops was not within; he was shepherding his fat flocks in the pasture. So we went inside and gazed at everything in wonder: crates were loaded with cheeses, and the pens were crowded with lambs and kids, each age kept separate.'
      },
      {
        id: 'odyssey-4',
        chapterIndex: 4,
        title: 'Chapter 4: The Song of the Sirens',
        durationSeconds: 360,
        transcript: 'Next the Sirens will sing their song and enchant you; they bewitch anyone who comes near. If a man draws close unknowingly and hears the Sirens’ voices, his wife and little children will never welcome him home rejoicing, for the Sirens sit in their meadow and entice him with honeyed melody.'
      }
    ]
  },
  {
    id: 'dracula',
    title: 'Dracula',
    author: 'Bram Stoker',
    narrator: 'Victor Blackwood',
    category: 'Horror',
    rating: 4.7,
    ratingCount: 4120,
    totalDurationSeconds: 1340,
    releaseYear: 1897,
    description: 'The chilling epistolary chronicle of Count Dracula’s sinister migration from Transylvania to Victorian England.',
    coverGradient: {
      from: '#31102f',
      via: '#581c87',
      to: '#0a0a0a',
      accent: '#e879f9',
      textColor: '#fae8ff'
    },
    chapters: [
      {
        id: 'dracula-1',
        chapterIndex: 1,
        title: 'Chapter 1: Jonathan Harker’s Journal in Bistritz',
        durationSeconds: 330,
        transcript: '3 May. Bistritz.—Left Munich at 8:35 P. M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets.'
      },
      {
        id: 'dracula-2',
        chapterIndex: 2,
        title: 'Chapter 2: Welcome to Castle Dracula',
        durationSeconds: 340,
        transcript: 'The castle was on the very edge of a tremendous precipice. A stone falling from the window would fall a thousand feet without touching anything! As far as the eye could reach was a sea of green tree tops, with occasionally a deep rift where there was a chasm.'
      },
      {
        id: 'dracula-3',
        chapterIndex: 3,
        title: 'Chapter 3: The Three Sisters of the Night',
        durationSeconds: 335,
        transcript: 'I thought I must have fallen asleep, for everything around me seemed like a dream. In the moonlight stood three young women, ladies by their dress and manner. I thought that I was sleeping, yet I knew that they were real, with breath that smelled like bitter almonds and sharp white teeth that glittered.'
      },
      {
        id: 'dracula-4',
        chapterIndex: 4,
        title: 'Chapter 4: The Demeter Logbook',
        durationSeconds: 335,
        transcript: 'Log of the "Demeter" of Varna, bound for Whitby. Run from Varna with cargo of silver sand and boxes of earth. Rough seas, strange fog, crew vanishing one by one in the night watches. God preserve our souls.'
      }
    ]
  },
  {
    id: 'time-machine',
    title: 'The Time Machine',
    author: 'H.G. Wells',
    narrator: 'Arthur Pendelton',
    category: 'Sci-Fi',
    rating: 4.8,
    ratingCount: 3150,
    totalDurationSeconds: 1210,
    releaseYear: 1895,
    description: 'An English scientist invents a machine that hurls him into the far future of humankind, discovering the frail Eloi and subterranean Morlocks.',
    coverGradient: {
      from: '#1e293b',
      via: '#334155',
      to: '#0f172a',
      accent: '#38bdf8',
      textColor: '#e0f2fe'
    },
    chapters: [
      {
        id: 'time-1',
        chapterIndex: 1,
        title: 'Chapter 1: The Fourth Dimension Explained',
        durationSeconds: 300,
        transcript: 'The Time Traveller was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burnt brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses.'
      },
      {
        id: 'time-2',
        chapterIndex: 2,
        title: 'Chapter 2: The Voyage Through Time',
        durationSeconds: 305,
        transcript: 'I drew a breath, set my teeth, gripped the starting lever with both hands, and went off with a thud. The laboratory grew faint and hazy. Mrs. Watchett came in, and walked, apparently without seeing me, towards the garden door. I suppose it took her a minute or so to traverse the place, but to my eyes she seemed to dart across the room like a rocket.'
      },
      {
        id: 'time-3',
        chapterIndex: 3,
        title: 'Chapter 3: The Golden Age of 802,701 AD',
        durationSeconds: 300,
        transcript: 'In another moment I was halted. The enormous colossal Sphinx in white marble loomed above me through the hail and rain. The sun burst through the clouds, and around me gathered miniature human beings draped in soft purple tunics, their eyes wide with childlike innocence.'
      },
      {
        id: 'time-4',
        chapterIndex: 4,
        title: 'Chapter 4: Darkness and the Underground Wells',
        durationSeconds: 305,
        transcript: 'Below the paradise of the surface dwellers, deep air shafts pulsed with rhythmic mechanical breath. In the pitch blackness of the caverns, pale luminous eyes watched me from the labyrinth of giant bronze gear wheels.'
      }
    ]
  }
];
