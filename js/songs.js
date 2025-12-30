/**
 * Idol Rhythm Game - 楽曲・譜面データ
 * 
 * 各難易度の特徴:
 * - EASY: ノーツ数少なめ、ゆっくり、主に中央レーン
 * - NORMAL: 標準的な難易度、全レーン使用
 * - HARD: ノーツ数多め、速い、同時押し多め
 * - EXPERT: 高密度、高速、複雑なパターン
 */

// 譜面生成ヘルパー関数
function generateChart(bpm, duration, difficulty) {
    const notes = [];
    const beatInterval = 60000 / bpm; // 1拍の時間（ミリ秒）
    
    // 難易度ごとの設定
    const config = {
        easy: {
            noteDensity: 0.25,      // 4分音符ごと
            useLanes: [3, 4, 5],   // 中央付近のみ
            simultaneousChance: 0,  // 同時押しなし
            flickChance: 0,         // フリックなし
            longChance: 0           // ロングなし
        },
        normal: {
            noteDensity: 0.5,       // 2分音符ごと
            useLanes: [1, 2, 3, 4, 5, 6, 7],
            simultaneousChance: 0.1,
            flickChance: 0.05,
            longChance: 0.05
        },
        hard: {
            noteDensity: 1,         // 4分音符ごと
            useLanes: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            simultaneousChance: 0.2,
            flickChance: 0.1,
            longChance: 0.1
        },
        expert: {
            noteDensity: 2,         // 8分音符ごと
            useLanes: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            simultaneousChance: 0.3,
            flickChance: 0.15,
            longChance: 0.15
        }
    };
    
    const cfg = config[difficulty];
    const noteInterval = beatInterval / cfg.noteDensity;
    
    // 最初の2秒は準備時間
    let time = 2000;
    
    while (time < duration - 2000) {
        // ノーツタイプ決定
        let type = 'tap';
        if (Math.random() < cfg.flickChance) {
            type = 'flick';
        } else if (Math.random() < cfg.longChance) {
            type = 'long';
        }
        
        // レーン決定
        const lane = cfg.useLanes[Math.floor(Math.random() * cfg.useLanes.length)];
        
        notes.push({ time: Math.round(time), lane, type });
        
        // 同時押し
        if (Math.random() < cfg.simultaneousChance) {
            let secondLane;
            do {
                secondLane = cfg.useLanes[Math.floor(Math.random() * cfg.useLanes.length)];
            } while (secondLane === lane);
            
            notes.push({ time: Math.round(time), lane: secondLane, type: 'tap' });
        }
        
        time += noteInterval;
    }
    
    return { notes };
}

// 楽曲データ
const SONGS = [
    {
        id: 'starlight_stage',
        title: 'Starlight Stage',
        artist: 'Dream Idol Unit',
        bpm: 140,
        icon: '⭐',
        duration: 60000, // 60秒
        charts: {
            easy: generateChart(140, 60000, 'easy'),
            normal: generateChart(140, 60000, 'normal'),
            hard: generateChart(140, 60000, 'hard'),
            expert: generateChart(140, 60000, 'expert')
        }
    },
    {
        id: 'rainbow_dream',
        title: 'Rainbow Dream',
        artist: 'Prism Hearts',
        bpm: 160,
        icon: '🌈',
        duration: 55000,
        charts: {
            easy: generateChart(160, 55000, 'easy'),
            normal: generateChart(160, 55000, 'normal'),
            hard: generateChart(160, 55000, 'hard'),
            expert: generateChart(160, 55000, 'expert')
        }
    },
    {
        id: 'eternal_melody',
        title: 'Eternal Melody',
        artist: 'Celestial Voice',
        bpm: 128,
        icon: '🎵',
        duration: 65000,
        charts: {
            easy: generateChart(128, 65000, 'easy'),
            normal: generateChart(128, 65000, 'normal'),
            hard: generateChart(128, 65000, 'hard'),
            expert: generateChart(128, 65000, 'expert')
        }
    },
    {
        id: 'miracle_flash',
        title: 'Miracle Flash',
        artist: 'Sparkle Stars',
        bpm: 180,
        icon: '✨',
        duration: 50000,
        charts: {
            easy: generateChart(180, 50000, 'easy'),
            normal: generateChart(180, 50000, 'normal'),
            hard: generateChart(180, 50000, 'hard'),
            expert: generateChart(180, 50000, 'expert')
        }
    },
    {
        id: 'dancing_queen',
        title: 'Dancing Queen',
        artist: 'Royal Crown',
        bpm: 150,
        icon: '👑',
        duration: 58000,
        charts: {
            easy: generateChart(150, 58000, 'easy'),
            normal: generateChart(150, 58000, 'normal'),
            hard: generateChart(150, 58000, 'hard'),
            expert: generateChart(150, 58000, 'expert')
        }
    },
    {
        id: 'love_confession',
        title: 'Love Confession',
        artist: 'Heartbeat',
        bpm: 135,
        icon: '💕',
        duration: 62000,
        charts: {
            easy: generateChart(135, 62000, 'easy'),
            normal: generateChart(135, 62000, 'normal'),
            hard: generateChart(135, 62000, 'hard'),
            expert: generateChart(135, 62000, 'expert')
        }
    },
    {
        id: 'neon_lights',
        title: 'Neon Lights',
        artist: 'Electric Pulse',
        bpm: 175,
        icon: '🌟',
        duration: 48000,
        charts: {
            easy: generateChart(175, 48000, 'easy'),
            normal: generateChart(175, 48000, 'normal'),
            hard: generateChart(175, 48000, 'hard'),
            expert: generateChart(175, 48000, 'expert')
        }
    },
    {
        id: 'cherry_blossom',
        title: 'Cherry Blossom Dance',
        artist: 'Spring Melody',
        bpm: 120,
        icon: '🌸',
        duration: 70000,
        charts: {
            easy: generateChart(120, 70000, 'easy'),
            normal: generateChart(120, 70000, 'normal'),
            hard: generateChart(120, 70000, 'hard'),
            expert: generateChart(120, 70000, 'expert')
        }
    }
];

// カスタム譜面の例（手動で作成する場合）
const CUSTOM_CHART_EXAMPLE = {
    notes: [
        // time: ミリ秒, lane: 0-8, type: 'tap' | 'long' | 'flick'
        { time: 2000, lane: 4, type: 'tap' },
        { time: 2500, lane: 3, type: 'tap' },
        { time: 2500, lane: 5, type: 'tap' }, // 同時押し
        { time: 3000, lane: 4, type: 'tap' },
        { time: 3500, lane: 2, type: 'tap' },
        { time: 3500, lane: 6, type: 'tap' },
        { time: 4000, lane: 4, type: 'long' },
        { time: 4500, lane: 1, type: 'tap' },
        { time: 4500, lane: 7, type: 'tap' },
        { time: 5000, lane: 4, type: 'flick' },
        // ... 続く
    ]
};
