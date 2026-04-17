'use strict';
const {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, HeadingLevel, AlignmentType, WidthType, ShadingType,
  BorderStyle, PageOrientation, convertInchesToTwip, TableBorders,
  LevelFormat, Packer, PageBreak, ExternalHyperlink, UnderlineType,
  VerticalAlign, TableLayoutType
} = require('docx');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const IMG_DIR = '/tmp/workout_images';
const OUT_FILE = path.join(__dirname, 'Workout_Nutrition_Guide.docx');
const CONTENT_WIDTH = 9360; // DXA — US Letter minus 1" margins each side
const IMG_COL_W = 2200;
const EXERCISE_COL_W = 2200;
const SETS_COL_W = 1100;
const CUES_COL_W = CONTENT_WIDTH - IMG_COL_W - EXERCISE_COL_W - SETS_COL_W; // 3860

// Colors
const NAVY = '1F3864';
const BLUE = '2E75B6';
const WHITE = 'FFFFFF';
const LIGHT_NAVY = 'D6DCE4';
const LIGHT_BLUE = 'BDD7EE';
const GRAY_BG = 'F2F2F2';

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

// ─────────────────────────────────────────────
// IMAGE DOWNLOAD
// ─────────────────────────────────────────────
const BASE = 'https://spotebi.com/wp-content/uploads';
const exercises = [
  // Monday
  { key: 'incline-dumbbell-press', urls: [
    `${BASE}/2015/04/dumbbell-chest-press-exercise-illustration.jpg`,
    `${BASE}/2016/02/chest-press-with-legs-extended-exercise-illustration-spotebi.jpg`,
  ]},
  { key: 'cable-chest-fly', urls: [
    `${BASE}/2015/04/chest-fly-exercise-illustration.jpg`,
    `${BASE}/2016/01/standing-chest-fly-exercise-illustration.jpg`,
  ]},
  { key: 'machine-chest-press', urls: [
    `${BASE}/2015/04/dumbbell-chest-press-exercise-illustration.jpg`,
    `${BASE}/2016/02/stability-ball-chest-press-exercise-illustration.jpg`,
  ]},
  { key: 'push-up', urls: [
    `${BASE}/2014/10/push-up-exercise-illustration.jpg`,
    `${BASE}/2014/10/knee-push-up-exercise-illustration.jpg`,
  ]},
  { key: 'dead-bug', urls: [
    `${BASE}/2015/05/dead-bug-exercise-illustration.jpg`,
  ]},
  { key: 'plank', urls: [
    `${BASE}/2014/10/plank-exercise-illustration.jpg`,
    `${BASE}/2014/10/side-plank-exercise-illustration.jpg`,
  ]},
  // Tuesday
  { key: 'leg-press', urls: [
    `${BASE}/2014/10/squat-exercise-illustration.jpg`,
    `${BASE}/2015/02/side-to-side-squats-exercise-illustration.jpg`,
  ]},
  { key: 'goblet-squat', urls: [
    `${BASE}/2014/10/squat-exercise-illustration.jpg`,
    `${BASE}/2015/05/sumo-squat-exercise-illustration.jpg`,
  ]},
  { key: 'leg-extension', urls: [
    `${BASE}/2014/10/straight-leg-raise-exercise-illustration.jpg`,
    `${BASE}/2014/10/squat-exercise-illustration.jpg`,
  ]},
  { key: 'lying-leg-curl', urls: [
    `${BASE}/2015/05/lying-hamstring-curls-exercise-illustration.jpg`,
  ]},
  { key: 'hip-thrust', urls: [
    `${BASE}/2015/01/glute-bridge-exercise-illustration.jpg`,
    `${BASE}/2017/06/chest-fly-glute-bridge-exercise-illustration-spotebi.jpg`,
  ]},
  { key: 'calf-raise', urls: [
    `${BASE}/2015/05/calf-raises-exercise-illustration.jpg`,
    `${BASE}/2016/07/plie-squat-calf-raise-exercise-illustration-spotebi.jpg`,
  ]},
  // Thursday
  { key: 'seated-dumbbell-curl', urls: [
    `${BASE}/2014/10/biceps-curl-exercise-illustration.jpg`,
    `${BASE}/2016/03/concentration-curl-exercise-illustration-spotebi.jpg`,
  ]},
  { key: 'cable-hammer-curl', urls: [
    `${BASE}/2015/04/hammer-curls-exercise-illustration.jpg`,
  ]},
  { key: 'preacher-curl', urls: [
    `${BASE}/2016/03/concentration-curl-exercise-illustration-spotebi.jpg`,
    `${BASE}/2014/10/biceps-curl-exercise-illustration.jpg`,
  ]},
  { key: 'seated-lateral-raise', urls: [
    `${BASE}/2014/10/dumbbell-lateral-raise-exercise-illustration.jpg`,
    `${BASE}/2014/10/bent-over-lateral-raise-exercise-illustration.jpg`,
  ]},
  { key: 'cable-face-pull', urls: [
    `${BASE}/2015/04/wide-row-exercise-illustration.jpg`,
    `${BASE}/2017/02/bent-over-row-press-exercise-illustration-spotebi.jpg`,
  ]},
  { key: 'bird-dog', urls: [
    `${BASE}/2014/10/bird-dogs-exercise-illustration.jpg`,
    `${BASE}/2016/02/plank-bird-dog-exercise-illustration-spotebi.jpg`,
  ]},
  // Friday
  { key: 'romanian-deadlift', urls: [
    `${BASE}/2015/05/romanian-deadlift-exercise-illustration.jpg`,
    `${BASE}/2015/04/single-leg-deadlift-exercise-illustration.jpg`,
  ]},
  { key: 'step-up', urls: [
    `${BASE}/2015/05/step-up-with-knee-raise-exercise-illustration.jpg`,
    `${BASE}/2016/09/step-up-crossover-exercise-illustration-spotebi.jpg`,
  ]},
  { key: 'reverse-lunge', urls: [
    `${BASE}/2014/10/lunges-exercise-illustration.jpg`,
    `${BASE}/2015/01/curtsy-lunge-exercise-illustration.jpg`,
  ]},
  { key: 'seated-leg-curl', urls: [
    `${BASE}/2015/05/lying-hamstring-curls-exercise-illustration.jpg`,
  ]},
  { key: 'glute-bridge', urls: [
    `${BASE}/2015/01/glute-bridge-exercise-illustration.jpg`,
    `${BASE}/2017/06/chest-fly-glute-bridge-exercise-illustration-spotebi.jpg`,
  ]},
];

async function downloadImage(key, urls) {
  // Support both .png and .jpg extensions
  for (const ext of ['jpg', 'png']) {
    const fp = path.join(IMG_DIR, `${key}.${ext}`);
    if (fs.existsSync(fp) && fs.statSync(fp).size > 1000) {
      console.log(`  ✓ cached: ${key}.${ext}`);
      return { path: fp, ext };
    }
  }
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
      });
      if (res.ok) {
        const buf = await res.buffer();
        if (buf.length > 500) {
          const ext = url.endsWith('.png') ? 'png' : 'jpg';
          const fp = path.join(IMG_DIR, `${key}.${ext}`);
          fs.writeFileSync(fp, buf);
          console.log(`  ✓ downloaded: ${key}.${ext} (${buf.length} bytes)`);
          return { path: fp, ext };
        }
      }
    } catch (e) {
      // try next
    }
  }
  console.log(`  ✗ failed: ${key} — will use placeholder`);
  return null;
}

// ─────────────────────────────────────────────
// DOC HELPERS
// ─────────────────────────────────────────────
function noBorder() {
  return { style: BorderStyle.NONE, size: 0, color: 'auto' };
}
function clearBorders() {
  return new TableBorders({
    top: noBorder(), bottom: noBorder(),
    left: noBorder(), right: noBorder(),
    insideHorizontal: noBorder(), insideVertical: noBorder(),
  });
}

function coloredHeader(text, bgColor, textColor = WHITE) {
  return new Paragraph({
    spacing: { before: 300, after: 100 },
    shading: { type: ShadingType.CLEAR, fill: bgColor },
    children: [new TextRun({
      text,
      bold: true,
      size: 28,
      color: textColor,
      font: 'Arial',
    })],
    indent: { left: 160, right: 160 },
  });
}

function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 400, after: 160 },
    shading: { type: ShadingType.CLEAR, fill: NAVY },
    children: [new TextRun({
      text,
      bold: true,
      size: 32,
      color: WHITE,
      font: 'Arial',
    })],
    indent: { left: 200, right: 200 },
  });
}

function bodyPara(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({
      text,
      size: opts.size || 20,
      bold: opts.bold || false,
      italics: opts.italic || false,
      color: opts.color || '000000',
      font: 'Arial',
    })],
  });
}

function bulletPara(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 20, font: 'Arial', color: '000000' })],
  });
}

function hRule() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: NAVY } },
    children: [],
  });
}

function pageBreakPara() {
  return new Paragraph({ children: [new PageBreak()] });
}

function makeImageRun(buf, w = 1980000, h = 1320000) {
  return new ImageRun({
    data: buf,
    transformation: { width: Math.round(w / 9144), height: Math.round(h / 9144) },
    type: 'png',
  });
}

// ─────────────────────────────────────────────
// EXERCISE TABLE BUILDER
// ─────────────────────────────────────────────
function exerciseHeaderRow() {
  const cellStyle = (text) => new TableCell({
    shading: { type: ShadingType.CLEAR, fill: NAVY },
    width: { size: 100, type: WidthType.AUTO },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: WHITE, size: 18, font: 'Arial' })],
    })],
    verticalAlign: VerticalAlign.CENTER,
  });
  return new TableRow({
    children: [
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: NAVY },
        width: { size: IMG_COL_W, type: WidthType.DXA },
        children: [new Paragraph({
          children: [new TextRun({ text: 'Image', bold: true, color: WHITE, size: 18, font: 'Arial' })],
        })],
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: NAVY },
        width: { size: EXERCISE_COL_W, type: WidthType.DXA },
        children: [new Paragraph({
          children: [new TextRun({ text: 'Exercise', bold: true, color: WHITE, size: 18, font: 'Arial' })],
        })],
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: NAVY },
        width: { size: SETS_COL_W, type: WidthType.DXA },
        children: [new Paragraph({
          children: [new TextRun({ text: 'Sets × Reps', bold: true, color: WHITE, size: 18, font: 'Arial' })],
        })],
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: NAVY },
        width: { size: CUES_COL_W, type: WidthType.DXA },
        children: [new Paragraph({
          children: [new TextRun({ text: 'Form Cue', bold: true, color: WHITE, size: 18, font: 'Arial' })],
        })],
      }),
    ],
    tableHeader: true,
  });
}

function exerciseRow(exercise, imgBuf, imgType, isAlt) {
  const bg = isAlt ? GRAY_BG : WHITE;
  const imgCellChildren = [];
  if (imgBuf) {
    const wPx = 138; // ~1.4" at 96dpi
    const hPx = 92;
    imgCellChildren.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({ data: imgBuf, transformation: { width: wPx, height: hPx }, type: imgType || 'jpg' })],
    }));
  } else {
    imgCellChildren.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: '[image]', size: 16, color: '888888', italics: true, font: 'Arial' })],
    }));
  }

  const ytQuery = encodeURIComponent(exercise.name + ' exercise form');
  const ytUrl = `https://www.youtube.com/results?search_query=${ytQuery}`;

  return new TableRow({
    children: [
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: bg },
        width: { size: IMG_COL_W, type: WidthType.DXA },
        children: imgCellChildren,
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: bg },
        width: { size: EXERCISE_COL_W, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 40, left: 80, right: 80 },
        children: [
          new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text: exercise.name, bold: true, size: 20, font: 'Arial', color: NAVY })],
          }),
          new Paragraph({
            children: [new ExternalHyperlink({
              link: ytUrl,
              children: [new TextRun({
                text: '▶ Watch on YouTube',
                size: 16, color: '0563C1', font: 'Arial',
                style: 'Hyperlink',
                underline: { type: UnderlineType.SINGLE },
              })],
            })],
          }),
        ],
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: bg },
        width: { size: SETS_COL_W, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: exercise.sets, size: 18, font: 'Arial', bold: true, color: '333333' })],
        })],
      }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: bg },
        width: { size: CUES_COL_W, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [new Paragraph({
          children: [new TextRun({ text: exercise.cue, size: 18, font: 'Arial', italics: true, color: '444444' })],
        })],
      }),
    ],
  });
}

function buildExerciseTable(dayExercises, images, imageTypes) {
  const rows = [exerciseHeaderRow()];
  dayExercises.forEach((ex, i) => {
    const buf = images[ex.imgKey] || null;
    const imgType = imageTypes ? imageTypes[ex.imgKey] : 'jpg';
    rows.push(exerciseRow(ex, buf, imgType, i % 2 === 1));
  });
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows,
    borders: new TableBorders({
      top: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
    }),
  });
}

// ─────────────────────────────────────────────
// STAT BAR TABLE
// ─────────────────────────────────────────────
function makeStatBar(stats) {
  const cellW = Math.floor(CONTENT_WIDTH / stats.length);
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [new TableRow({
      children: stats.map((s, i) => new TableCell({
        shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? NAVY : BLUE },
        width: { size: cellW, type: WidthType.DXA },
        margins: { top: 120, bottom: 120, left: 120, right: 120 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: s.value, bold: true, size: 28, color: WHITE, font: 'Arial' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: s.label, size: 16, color: 'BDD7EE', font: 'Arial' })],
          }),
        ],
      })),
    })],
  });
}

function makeMacroBar(macros) {
  const cellW = Math.floor(CONTENT_WIDTH / macros.length);
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [new TableRow({
      children: macros.map((m, i) => {
        const fills = ['1A5E3A', '0A3D62', '7D3C98', 'B7360A'];
        return new TableCell({
          shading: { type: ShadingType.CLEAR, fill: fills[i] || NAVY },
          width: { size: cellW, type: WidthType.DXA },
          margins: { top: 120, bottom: 120, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: m.value, bold: true, size: 24, color: WHITE, font: 'Arial' })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: m.label, size: 16, color: 'DDDDDD', font: 'Arial' })],
            }),
          ],
        });
      }),
    })],
  });
}

// ─────────────────────────────────────────────
// LOAD CONFIG
// ─────────────────────────────────────────────
const C = JSON.parse(fs.readFileSync(path.join(__dirname, 'workout_config.json'), 'utf8'));

const gymDays = C.workoutDays.filter(d => d.exercises);
const mondayExercises   = (C.workoutDays.find(d => d.day === 'MONDAY')   || {}).exercises || [];
const tuesdayExercises  = (C.workoutDays.find(d => d.day === 'TUESDAY')  || {}).exercises || [];
const thursdayExercises = (C.workoutDays.find(d => d.day === 'THURSDAY') || {}).exercises || [];
const fridayExercises   = (C.workoutDays.find(d => d.day === 'FRIDAY')   || {}).exercises || [];

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('Downloading exercise images...');
  const images = {};
  const imageTypes = {};
  const results = { success: [], failed: [] };
  for (const ex of exercises) {
    const result = await downloadImage(ex.key, ex.urls);
    if (result) {
      images[ex.key] = fs.readFileSync(result.path);
      imageTypes[ex.key] = result.ext === 'png' ? 'png' : 'jpg';
      results.success.push(ex.key);
    } else {
      images[ex.key] = null;
      imageTypes[ex.key] = 'png';
      results.failed.push(ex.key);
    }
  }

  console.log('\nBuilding document...');

  // ── COVER PAGE ──────────────────────────────
  const coverChildren = [
    new Paragraph({ spacing: { before: 0, after: 0 }, children: [] }),
    new Paragraph({ spacing: { before: 2000, after: 200 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.CLEAR, fill: NAVY },
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: C.profile.title.toUpperCase(), bold: true, size: 56, color: WHITE, font: 'Arial' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.CLEAR, fill: NAVY },
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: ' ', size: 16, font: 'Arial', color: NAVY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.CLEAR, fill: BLUE },
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: C.profile.subtitle, bold: true, size: 32, color: WHITE, font: 'Arial' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.CLEAR, fill: BLUE },
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: ' ', size: 8, font: 'Arial', color: BLUE })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      children: [new TextRun({ text: C.profile.tagline, size: 24, color: NAVY, font: 'Arial', italics: true })],
    }),
    new Paragraph({ spacing: { before: 300, after: 300 }, children: [] }),
    makeStatBar(C.profile.stats),
    new Paragraph({ spacing: { before: 600, after: 0 }, children: [] }),
    pageBreakPara(),
  ];

  // ── SECTION 1 — HOW THIS PLAN WORKS ─────────
  const section1Children = [
    sectionTitle('SECTION 1 — HOW THIS PLAN WORKS'),
    new Paragraph({ spacing: { before: 200, after: 100 }, children: [
      new TextRun({ text: 'Philosophy: Maximum Stimulus, Zero Unnecessary Spinal Load', bold: true, size: 24, font: 'Arial', color: NAVY }),
    ]}),
    bodyPara('Every decision in this plan — exercise selection, loading, posture, and sequence — is filtered through one question: does this create spinal risk? If yes, we find a better tool. The goal is to build muscle, burn fat, and move well for decades. Swimming stays. Barbell back squats don\'t.'),
    new Paragraph({ spacing: { before: 200, after: 80 }, children: [
      new TextRun({ text: 'Weekly Structure', bold: true, size: 22, font: 'Arial', color: NAVY }),
    ]}),
    makeWeekTable(),
    new Paragraph({ spacing: { before: 240, after: 80 }, children: [
      new TextRun({ text: 'Lower Back Rules — Non-Negotiable', bold: true, size: 22, font: 'Arial', color: '8B0000' }),
    ]}),
    ...C.lowerBackRules.map(r => bulletPara(r)),
    pageBreakPara(),
  ];

  // ── SECTION 2 — WORKOUT PLAN ─────────────────
  const section2Children = [
    sectionTitle('SECTION 2 — WORKOUT PLAN'),

    // Monday
    coloredHeader('  MONDAY — Chest + Core', '1F3864'),
    new Paragraph({ spacing: { before: 80, after: 80 }, children: [
      new TextRun({ text: 'Core activation warm-up (5 min) before lifting. See Section 4 for protocol.', italics: true, size: 18, font: 'Arial', color: '666666' }),
    ]}),
    buildExerciseTable(mondayExercises, images, imageTypes),
    new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }),

    // Tuesday
    coloredHeader('  TUESDAY — Legs: Quad & Glute Focus', '1A6B4B'),
    new Paragraph({ spacing: { before: 80, after: 80 }, children: [
      new TextRun({ text: 'Core activation warm-up (5 min) before lifting. Focus on controlled range — these muscles are being rebuilt from scratch.', italics: true, size: 18, font: 'Arial', color: '666666' }),
    ]}),
    buildExerciseTable(tuesdayExercises, images, imageTypes),
    new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }),

    // Wednesday
    coloredHeader('  WEDNESDAY — Swim', '1565A0'),
    new Paragraph({ spacing: { before: 120, after: 80 }, children: [
      new TextRun({ text: '30-45 minutes of lap swimming.', bold: true, size: 20, font: 'Arial' }),
    ]}),
    bodyPara('Mix freestyle and backstroke. Backstroke is particularly valuable here — it decompresses the lumbar spine and opens the thoracic region in the opposite direction from sitting. On high back-sensitivity days, use a pull buoy for the entire session to take legs out of the equation and keep all rotation gentle.'),
    bodyPara('This session is cardio, active recovery, and back therapy simultaneously. Don\'t skip it.'),
    new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }),

    // Thursday
    coloredHeader('  THURSDAY — Biceps + Shoulders + Core', '7B1F3B'),
    new Paragraph({ spacing: { before: 80, after: 80 }, children: [
      new TextRun({ text: 'Core activation warm-up (5 min). All curls are SEATED — this eliminates the temptation to swing through the lower back.', italics: true, size: 18, font: 'Arial', color: '666666' }),
    ]}),
    buildExerciseTable(thursdayExercises, images, imageTypes),
    new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }),

    // Friday
    coloredHeader('  FRIDAY — Legs: Posterior Chain & Hinge', '5B3A8A'),
    new Paragraph({ spacing: { before: 80, after: 80 }, children: [
      new TextRun({ text: 'Core activation warm-up (5 min). The Romanian Deadlift is included but keep weights LIGHT — this is a hinge pattern, not a strength test. Technique first, always.', italics: true, size: 18, font: 'Arial', color: '666666' }),
    ]}),
    buildExerciseTable(fridayExercises, images, imageTypes),
    new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }),

    // Saturday
    coloredHeader('  SATURDAY — Swim (Longer Session)', '1565A0'),
    bodyPara('45-60 minutes. Kick sets, pull buoy intervals, or technique drills. Use this session to work on breathing rhythm and stroke mechanics if desired. Consider water aerobics or aqua jogging for variety while staying gentle on the spine.'),
    new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }),

    // Sunday
    coloredHeader('  SUNDAY — Active Recovery', '666666'),
    bodyPara('20-30 minute walk, light stretching, or yoga. Focus on hip flexors, hamstrings, and thoracic rotation. This is not a rest day in the sedentary sense — it\'s active recovery. Move, but don\'t load.'),
    pageBreakPara(),
  ];

  // ── SECTION 3 — NUTRITION ────────────────────
  const N = C.nutrition;
  const section3Children = [
    sectionTitle('SECTION 3 — NUTRITION PLAN'),
    new Paragraph({ spacing: { before: 160, after: 80 }, children: [
      new TextRun({ text: `Eating Window: ${N.eatingWindow}`, bold: true, size: 24, font: 'Arial', color: NAVY }),
    ]}),
    bodyPara(N.fastingNote),
    new Paragraph({ spacing: { before: 200, after: 120 }, children: [
      new TextRun({ text: 'Daily Macro Targets', bold: true, size: 22, font: 'Arial', color: NAVY }),
    ]}),
    makeMacroBar(N.macros),
    ...N.meals.flatMap(meal => [
      new Paragraph({ spacing: { before: 300, after: 80 }, children: [
        new TextRun({ text: meal.name, bold: true, size: 22, font: 'Arial', color: '1A6B4B' }),
      ]}),
      ...meal.items.map(item => bulletPara(item)),
    ]),
    new Paragraph({ spacing: { before: 240, after: 80 }, children: [
      new TextRun({ text: 'Rules & Limits', bold: true, size: 22, font: 'Arial', color: '8B0000' }),
    ]}),
    ...N.rules.map(r => bulletPara(r)),
    pageBreakPara(),
  ];

  // ── SECTION 4 — BACK SAFETY ──────────────────
  const section4Children = [
    sectionTitle('SECTION 4 — BACK SAFETY & RECOVERY'),
    new Paragraph({ spacing: { before: 200, after: 80 }, children: [
      new TextRun({ text: 'Pre-Workout Activation (Every Session — 5 Minutes)', bold: true, size: 22, font: 'Arial', color: NAVY }),
    ]}),
    bodyPara('Do this EVERY session without exception. This sequence fires the deep stabilizers that protect the lumbar spine before any loading begins.'),
    makeActivationTable(),
    new Paragraph({ spacing: { before: 300, after: 80 }, children: [
      new TextRun({ text: 'Post-Workout Stretching (5-10 Minutes)', bold: true, size: 22, font: 'Arial', color: NAVY }),
    ]}),
    makeStretchTable(),
    new Paragraph({ spacing: { before: 300, after: 80 }, children: [
      new TextRun({ text: 'Professional Assessment', bold: true, size: 22, font: 'Arial', color: '8B0000' }),
    ]}),
    new Paragraph({ spacing: { before: 80, after: 80 }, shading: { type: ShadingType.CLEAR, fill: 'FFF3CD' }, children: [
      new TextRun({ text: '  Recommendation: Schedule one session with a sports physical therapist within your first month in Tampa. Get a baseline assessment of your lumbar spine mechanics under movement. A 55-year-old with chronic lower back history who is returning to structured training will benefit enormously from knowing exactly where their ROM limits are before pushing into new patterns. This is not optional — it is smart.  ', size: 20, font: 'Arial', color: '856404' }),
    ]}),
  ];

  // ── ASSEMBLE ─────────────────────────────────
  const allChildren = [
    ...coverChildren,
    ...section1Children,
    ...section2Children,
    ...section3Children,
    ...section4Children,
  ];

  const doc = new Document({
    creator: 'Claude Code — Workout Guide Generator',
    title: 'Workout & Nutrition Guide',
    description: 'Personalized back-safe training and Mediterranean nutrition plan',
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 20, color: '222222' },
        },
      },
    },
    numbering: {
      config: [{
        reference: 'bullet-list',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: 720, hanging: 360 } },
            run: { font: 'Arial', size: 20 },
          },
        }],
      }],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
          },
        },
      },
      children: allChildren,
    }],
  });

  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT_FILE, buf);

  console.log('\n────────────────────────────────────────');
  console.log(`Document saved: ${OUT_FILE}`);
  console.log(`File size: ${(buf.length / 1024).toFixed(1)} KB`);
  console.log('\nImages embedded successfully:');
  results.success.forEach(k => console.log(`  ✓ ${k}`));
  if (results.failed.length) {
    console.log('\nImages that used placeholder:');
    results.failed.forEach(k => console.log(`  ✗ ${k}`));
  }
}

// ─────────────────────────────────────────────
// HELPER TABLES
// ─────────────────────────────────────────────
function makeWeekTable() {
  const days = C.weeklySchedule;
  const colW = Math.floor(CONTENT_WIDTH / days.length);
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        children: days.map(d => new TableCell({
          shading: { type: ShadingType.CLEAR, fill: d.color },
          width: { size: colW, type: WidthType.DXA },
          margins: { top: 100, bottom: 100, left: 80, right: 80 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: d.day, bold: true, size: 18, color: WHITE, font: 'Arial' })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: d.focus, size: 14, color: 'DDDDDD', font: 'Arial' })] }),
          ],
        })),
      }),
    ],
  });
}

function makeActivationTable() {
  const exercises = C.backSafety.preWorkout;
  const colW = Math.floor(CONTENT_WIDTH / 3);
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        children: ['Exercise', 'Sets/Reps', 'Note'].map((h, i) => new TableCell({
          shading: { type: ShadingType.CLEAR, fill: NAVY },
          width: { size: colW, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: WHITE, size: 18, font: 'Arial' })] })],
        })),
        tableHeader: true,
      }),
      ...exercises.map((e, i) => new TableRow({
        children: [e.name, e.sets, e.note].map((v, j) => new TableCell({
          shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? GRAY_BG : WHITE },
          width: { size: colW, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
          children: [new Paragraph({ children: [new TextRun({ text: v, size: 18, font: 'Arial', bold: j === 0, italics: j === 2 })] })],
        })),
      })),
    ],
    borders: new TableBorders({
      top: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
    }),
  });
}

function makeStretchTable() {
  const stretches = C.backSafety.postWorkout;
  const colW = Math.floor(CONTENT_WIDTH / 3);
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        children: ['Stretch', 'Duration', 'How-To'].map(h => new TableCell({
          shading: { type: ShadingType.CLEAR, fill: BLUE },
          width: { size: colW, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: WHITE, size: 18, font: 'Arial' })] })],
        })),
        tableHeader: true,
      }),
      ...stretches.map((s, i) => new TableRow({
        children: [s.name, s.duration, s.notes].map((v, j) => new TableCell({
          shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? LIGHT_BLUE : WHITE },
          width: { size: colW, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
          children: [new Paragraph({ children: [new TextRun({ text: v, size: 18, font: 'Arial', bold: j === 0, italics: j === 2 })] })],
        })),
      })),
    ],
    borders: new TableBorders({
      top: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
    }),
  });
}

main().catch(e => { console.error('ERROR:', e.message); console.error(e.stack); process.exit(1); });
