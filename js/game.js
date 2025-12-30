/**
 * Idol Rhythm Game - メインゲームロジック
 */

class RhythmGame {
    constructor() {
        // ゲーム状態
        this.state = 'title'; // title, songSelect, difficultySelect, playing, paused, result
        this.selectedSong = null;
        this.selectedDifficulty = null;
        
        // ゲームデータ
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.life = 100;
        this.judgeCounts = {
            perfect: 0,
            great: 0,
            good: 0,
            bad: 0,
            miss: 0
        };
        
        // ノーツ管理
        this.notes = [];
        this.activeNotes = [];
        this.noteIndex = 0;
        
        // タイミング
        this.startTime = 0;
        this.currentTime = 0;
        this.audioOffset = 0;
        this.isPlaying = false;
        
        // 判定基準（ミリ秒）
        this.judgeWindows = {
            perfect: 50,
            great: 100,
            good: 150,
            bad: 200
        };
        
        // スコア設定
        this.scoreValues = {
            perfect: 1000,
            great: 700,
            good: 400,
            bad: 100,
            miss: 0
        };
        
        // ノーツの移動時間（ミリ秒）
        this.noteSpeed = {
            easy: 2000,
            normal: 1500,
            hard: 1200,
            expert: 1000
        };
        
        // DOM要素
        this.screens = {
            title: document.getElementById('title-screen'),
            songSelect: document.getElementById('song-select-screen'),
            difficulty: document.getElementById('difficulty-screen'),
            game: document.getElementById('game-screen'),
            pause: document.getElementById('pause-screen'),
            result: document.getElementById('result-screen')
        };
        
        this.elements = {
            score: document.getElementById('score'),
            combo: document.getElementById('combo'),
            lifeFill: document.getElementById('life-fill'),
            progressFill: document.getElementById('progress-fill'),
            judgeDisplay: document.getElementById('judge-display'),
            noteField: document.getElementById('note-field'),
            songList: document.getElementById('song-list'),
            selectedSongName: document.getElementById('selected-song-name'),
            finalScore: document.getElementById('final-score'),
            resultRank: document.getElementById('result-rank'),
            perfectCount: document.getElementById('perfect-count'),
            greatCount: document.getElementById('great-count'),
            goodCount: document.getElementById('good-count'),
            badCount: document.getElementById('bad-count'),
            missCount: document.getElementById('miss-count'),
            maxCombo: document.getElementById('max-combo')
        };
        
        this.audio = document.getElementById('game-audio');
        this.tapSound = document.getElementById('tap-sound');
        
        // 判定サークル
        this.judgeCircles = document.querySelectorAll('.judge-circle');
        
        // イベント設定
        this.setupEventListeners();
        this.setupKeyboardControls();
        
        // 楽曲リスト生成
        this.generateSongList();
        
        // AudioContext初期化
        this.audioContext = null;
        
        console.log('Rhythm Game initialized');
    }
    
    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
        // タイトル画面
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showScreen('songSelect');
            this.playClickSound();
        });
        
        // 楽曲選択画面
        document.getElementById('back-to-title').addEventListener('click', () => {
            this.showScreen('title');
            this.playClickSound();
        });
        
        // 難易度選択画面
        document.getElementById('back-to-songs').addEventListener('click', () => {
            this.showScreen('songSelect');
            this.playClickSound();
        });
        
        // 難易度ボタン
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedDifficulty = btn.dataset.difficulty;
                this.startGame();
                this.playClickSound();
            });
        });
        
        // ゲーム画面
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.pauseGame();
        });
        
        // 一時停止画面
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.resumeGame();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('quit-btn').addEventListener('click', () => {
            this.quitToSongSelect();
        });
        
        // リザルト画面
        document.getElementById('retry-btn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('select-btn').addEventListener('click', () => {
            this.quitToSongSelect();
        });
        
        // 判定サークルのタップ/クリック
        this.judgeCircles.forEach((circle, index) => {
            // タッチイベント
            circle.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleTap(index);
            });
            
            // マウスイベント
            circle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.handleTap(index);
            });
        });
        
        // オーディオ終了時
        this.audio.addEventListener('ended', () => {
            this.endGame();
        });
    }
    
    /**
     * キーボードコントロール設定
     */
    setupKeyboardControls() {
        // キーとレーンの対応（A S D F Space J K L ;）
        const keyMap = {
            'KeyA': 0,
            'KeyS': 1,
            'KeyD': 2,
            'KeyF': 3,
            'Space': 4,
            'KeyJ': 5,
            'KeyK': 6,
            'KeyL': 7,
            'Semicolon': 8
        };
        
        document.addEventListener('keydown', (e) => {
            if (this.state !== 'playing') return;
            
            const lane = keyMap[e.code];
            if (lane !== undefined) {
                e.preventDefault();
                this.handleTap(lane);
            }
            
            // Escapeで一時停止
            if (e.code === 'Escape') {
                this.pauseGame();
            }
        });
    }
    
    /**
     * 楽曲リスト生成
     */
    generateSongList() {
        this.elements.songList.innerHTML = '';
        
        SONGS.forEach((song, index) => {
            const card = document.createElement('div');
            card.className = 'song-card';
            card.innerHTML = `
                <div class="song-jacket">${song.icon || '♪'}</div>
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                    <div class="song-bpm">BPM: ${song.bpm}</div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                this.selectedSong = song;
                this.elements.selectedSongName.textContent = song.title;
                this.showScreen('difficulty');
                this.playClickSound();
            });
            
            this.elements.songList.appendChild(card);
        });
    }
    
    /**
     * 画面切り替え
     */
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        this.screens[screenName].classList.add('active');
        this.state = screenName;
    }
    
    /**
     * ゲーム開始
     */
    async startGame() {
        this.resetGameData();
        this.showScreen('game');
        
        // 譜面データ読み込み
        this.loadChart();
        
        // カウントダウン
        await this.countdown();
        
        // ゲーム開始
        this.isPlaying = true;
        this.startTime = performance.now();
        this.state = 'playing';
        
        // 音楽再生（デモ用にサイレントモード）
        // 実際には音声ファイルを設定して再生
        // this.audio.src = this.selectedSong.audioFile;
        // this.audio.play();
        
        // ゲームループ開始
        this.gameLoop();
    }
    
    /**
     * ゲームデータリセット
     */
    resetGameData() {
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.life = 100;
        this.judgeCounts = {
            perfect: 0,
            great: 0,
            good: 0,
            bad: 0,
            miss: 0
        };
        this.notes = [];
        this.activeNotes = [];
        this.noteIndex = 0;
        
        this.updateDisplay();
    }
    
    /**
     * 譜面データ読み込み
     */
    loadChart() {
        const chart = this.selectedSong.charts[this.selectedDifficulty];
        
        // 譜面データをコピー
        this.notes = chart.notes.map(note => ({
            ...note,
            hit: false,
            missed: false,
            element: null
        }));
        
        // 既存のノーツを削除
        document.querySelectorAll('.note').forEach(el => el.remove());
    }
    
    /**
     * カウントダウン
     */
    async countdown() {
        return new Promise(resolve => {
            let count = 3;
            
            const showCount = () => {
                if (count > 0) {
                    const countdownEl = document.createElement('div');
                    countdownEl.className = 'countdown';
                    countdownEl.textContent = count;
                    document.body.appendChild(countdownEl);
                    
                    setTimeout(() => {
                        countdownEl.remove();
                    }, 900);
                    
                    count--;
                    setTimeout(showCount, 1000);
                } else {
                    const startEl = document.createElement('div');
                    startEl.className = 'countdown';
                    startEl.textContent = 'START!';
                    document.body.appendChild(startEl);
                    
                    setTimeout(() => {
                        startEl.remove();
                        resolve();
                    }, 800);
                }
            };
            
            showCount();
        });
    }
    
    /**
     * ゲームループ
     */
    gameLoop() {
        if (!this.isPlaying) return;
        
        this.currentTime = performance.now() - this.startTime;
        
        // ノーツ生成
        this.spawnNotes();
        
        // ノーツ更新
        this.updateNotes();
        
        // ミス判定
        this.checkMissedNotes();
        
        // 進行バー更新
        this.updateProgress();
        
        // ゲーム終了チェック
        if (this.noteIndex >= this.notes.length && this.activeNotes.length === 0) {
            setTimeout(() => this.endGame(), 1000);
            return;
        }
        
        // 次フレーム
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * ノーツ生成
     */
    spawnNotes() {
        const speed = this.noteSpeed[this.selectedDifficulty];
        
        while (this.noteIndex < this.notes.length) {
            const note = this.notes[this.noteIndex];
            const spawnTime = note.time - speed;
            
            if (this.currentTime >= spawnTime) {
                this.createNoteElement(note);
                this.activeNotes.push(note);
                this.noteIndex++;
            } else {
                break;
            }
        }
    }
    
    /**
     * ノーツ要素作成
     */
    createNoteElement(note) {
        const noteEl = document.createElement('div');
        noteEl.className = 'note';
        if (note.type === 'long') noteEl.classList.add('long');
        if (note.type === 'flick') noteEl.classList.add('flick');
        
        noteEl.textContent = '♪';
        
        this.elements.noteField.appendChild(noteEl);
        note.element = noteEl;
    }
    
    /**
     * ノーツ更新
     */
    updateNotes() {
        const speed = this.noteSpeed[this.selectedDifficulty];
        
        this.activeNotes.forEach(note => {
            if (!note.element || note.hit || note.missed) return;
            
            const timeToHit = note.time - this.currentTime;
            const progress = 1 - (timeToHit / speed);
            
            // ノーツ位置計算（中心から判定サークルへ）
            const targetCircle = this.judgeCircles[note.lane];
            const fieldRect = this.elements.noteField.getBoundingClientRect();
            const circleRect = targetCircle.getBoundingClientRect();
            
            const centerX = fieldRect.width / 2;
            const centerY = fieldRect.height / 2;
            
            const targetX = circleRect.left - fieldRect.left + circleRect.width / 2;
            const targetY = circleRect.top - fieldRect.top + circleRect.height / 2;
            
            const currentX = centerX + (targetX - centerX) * progress;
            const currentY = centerY + (targetY - centerY) * progress;
            
            note.element.style.left = `${currentX - 20}px`;
            note.element.style.top = `${currentY - 20}px`;
            
            // スケール調整（遠くから近づいてくる感じ）
            const scale = 0.3 + (progress * 0.7);
            note.element.style.transform = `scale(${scale})`;
            note.element.style.opacity = Math.min(1, progress * 2);
        });
    }
    
    /**
     * ミス判定
     */
    checkMissedNotes() {
        const missThreshold = 250; // ミスと判定するまでの時間
        
        this.activeNotes.forEach(note => {
            if (note.hit || note.missed) return;
            
            const timeDiff = this.currentTime - note.time;
            
            if (timeDiff > missThreshold) {
                this.registerJudge('miss', note);
                note.missed = true;
                this.removeNote(note);
            }
        });
        
        // 処理済みノーツを削除
        this.activeNotes = this.activeNotes.filter(n => !n.hit && !n.missed);
    }
    
    /**
     * タップ処理
     */
    handleTap(lane) {
        if (this.state !== 'playing') return;
        
        // 視覚フィードバック
        const circle = this.judgeCircles[lane];
        circle.classList.add('active');
        setTimeout(() => circle.classList.remove('active'), 100);
        
        // タップ音
        this.playTapSound();
        
        // 対応するノーツを検索
        let closestNote = null;
        let closestTimeDiff = Infinity;
        
        for (const note of this.activeNotes) {
            if (note.lane !== lane || note.hit || note.missed) continue;
            
            const timeDiff = Math.abs(this.currentTime - note.time);
            
            if (timeDiff < closestTimeDiff && timeDiff < this.judgeWindows.bad + 50) {
                closestNote = note;
                closestTimeDiff = timeDiff;
            }
        }
        
        if (closestNote) {
            // 判定
            let judge;
            if (closestTimeDiff <= this.judgeWindows.perfect) {
                judge = 'perfect';
            } else if (closestTimeDiff <= this.judgeWindows.great) {
                judge = 'great';
            } else if (closestTimeDiff <= this.judgeWindows.good) {
                judge = 'good';
            } else if (closestTimeDiff <= this.judgeWindows.bad) {
                judge = 'bad';
            } else {
                return; // 範囲外
            }
            
            this.registerJudge(judge, closestNote);
            closestNote.hit = true;
            this.removeNote(closestNote);
        }
    }
    
    /**
     * 判定登録
     */
    registerJudge(judge, note) {
        // カウント更新
        this.judgeCounts[judge]++;
        
        // スコア計算
        const baseScore = this.scoreValues[judge];
        const comboBonus = Math.floor(this.combo / 10) * 10;
        this.score += baseScore + comboBonus;
        
        // コンボ更新
        if (judge === 'miss' || judge === 'bad') {
            this.combo = 0;
            this.life = Math.max(0, this.life - (judge === 'miss' ? 10 : 5));
        } else {
            this.combo++;
            if (this.combo > this.maxCombo) {
                this.maxCombo = this.combo;
            }
            if (judge === 'perfect') {
                this.life = Math.min(100, this.life + 1);
            }
        }
        
        // ライフチェック
        if (this.life <= 0) {
            this.endGame(true);
            return;
        }
        
        // 表示更新
        this.updateDisplay();
        this.showJudge(judge);
        
        // コンボエフェクト
        if (this.combo > 0 && this.combo % 50 === 0) {
            this.elements.combo.parentElement.classList.add('pulse');
            setTimeout(() => {
                this.elements.combo.parentElement.classList.remove('pulse');
            }, 200);
        }
    }
    
    /**
     * ノーツ削除
     */
    removeNote(note) {
        if (note.element) {
            if (note.hit) {
                note.element.classList.add('hit');
                setTimeout(() => note.element.remove(), 200);
            } else {
                note.element.remove();
            }
        }
    }
    
    /**
     * 判定表示
     */
    showJudge(judge) {
        const judgeEl = document.createElement('div');
        judgeEl.className = `judge-text ${judge}`;
        judgeEl.textContent = judge.toUpperCase();
        
        this.elements.judgeDisplay.innerHTML = '';
        this.elements.judgeDisplay.appendChild(judgeEl);
    }
    
    /**
     * 表示更新
     */
    updateDisplay() {
        this.elements.score.textContent = this.score.toLocaleString();
        this.elements.combo.textContent = this.combo;
        this.elements.lifeFill.style.width = `${this.life}%`;
        
        // ライフバーの色
        if (this.life <= 25) {
            this.elements.lifeFill.classList.add('danger');
            this.elements.lifeFill.classList.remove('warning');
        } else if (this.life <= 50) {
            this.elements.lifeFill.classList.add('warning');
            this.elements.lifeFill.classList.remove('danger');
        } else {
            this.elements.lifeFill.classList.remove('warning', 'danger');
        }
    }
    
    /**
     * 進行バー更新
     */
    updateProgress() {
        if (this.notes.length === 0) return;
        
        const lastNoteTime = this.notes[this.notes.length - 1].time;
        const progress = Math.min(100, (this.currentTime / lastNoteTime) * 100);
        this.elements.progressFill.style.width = `${progress}%`;
    }
    
    /**
     * ゲーム一時停止
     */
    pauseGame() {
        if (this.state !== 'playing') return;
        
        this.isPlaying = false;
        this.state = 'paused';
        this.screens.pause.classList.add('active');
        
        if (this.audio && !this.audio.paused) {
            this.audio.pause();
        }
    }
    
    /**
     * ゲーム再開
     */
    resumeGame() {
        this.screens.pause.classList.remove('active');
        this.isPlaying = true;
        this.state = 'playing';
        
        // 開始時間を調整
        this.startTime = performance.now() - this.currentTime;
        
        if (this.audio && this.audio.paused) {
            this.audio.play();
        }
        
        this.gameLoop();
    }
    
    /**
     * ゲームリスタート
     */
    restartGame() {
        this.screens.pause.classList.remove('active');
        this.screens.result.classList.remove('active');
        this.isPlaying = false;
        
        // 既存のノーツを削除
        document.querySelectorAll('.note').forEach(el => el.remove());
        
        // 再開始
        this.startGame();
    }
    
    /**
     * 楽曲選択に戻る
     */
    quitToSongSelect() {
        this.isPlaying = false;
        this.screens.pause.classList.remove('active');
        this.screens.result.classList.remove('active');
        
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        
        // 既存のノーツを削除
        document.querySelectorAll('.note').forEach(el => el.remove());
        
        this.showScreen('songSelect');
    }
    
    /**
     * ゲーム終了
     */
    endGame(failed = false) {
        this.isPlaying = false;
        
        if (this.audio) {
            this.audio.pause();
        }
        
        // リザルト表示
        this.showResult(failed);
    }
    
    /**
     * リザルト表示
     */
    showResult(failed = false) {
        this.elements.finalScore.textContent = this.score.toLocaleString();
        this.elements.perfectCount.textContent = this.judgeCounts.perfect;
        this.elements.greatCount.textContent = this.judgeCounts.great;
        this.elements.goodCount.textContent = this.judgeCounts.good;
        this.elements.badCount.textContent = this.judgeCounts.bad;
        this.elements.missCount.textContent = this.judgeCounts.miss;
        this.elements.maxCombo.textContent = this.maxCombo;
        
        // ランク計算
        const rank = this.calculateRank(failed);
        this.elements.resultRank.textContent = rank;
        
        this.showScreen('result');
    }
    
    /**
     * ランク計算
     */
    calculateRank(failed) {
        if (failed) return 'F';
        
        const totalNotes = this.notes.length;
        const perfectRate = this.judgeCounts.perfect / totalNotes;
        const greatRate = this.judgeCounts.great / totalNotes;
        const goodRate = this.judgeCounts.good / totalNotes;
        
        const accuracy = (perfectRate * 100 + greatRate * 70 + goodRate * 40) / 100;
        
        if (accuracy >= 0.95 && this.judgeCounts.miss === 0) return 'S';
        if (accuracy >= 0.90) return 'A';
        if (accuracy >= 0.80) return 'B';
        if (accuracy >= 0.70) return 'C';
        if (accuracy >= 0.60) return 'D';
        return 'E';
    }
    
    /**
     * クリック音再生
     */
    playClickSound() {
        // 簡易クリック音（WebAudio）
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return;
            }
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    /**
     * タップ音再生
     */
    playTapSound() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return;
            }
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', () => {
    window.game = new RhythmGame();
});
