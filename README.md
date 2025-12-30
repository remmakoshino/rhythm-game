# 🌟 Idol Rhythm Game - アイドルリズムゲーム 🌟

スクフェスやデレステにインスパイアされた、ブラウザで遊べるリズムゲームです。

## 🎮 ゲーム概要

アイドルたちが歌って踊るステージで、音楽に合わせてノーツをタップ！
9つの判定サークルに向かって流れてくるノーツを、タイミングよくタップしてスコアを競いましょう。

## ✨ 特徴

- **4段階の難易度**: EASY / NORMAL / HARD / EXPERT
- **8曲の楽曲**: 様々なBPMとスタイルの楽曲を収録
- **判定システム**: PERFECT / GREAT / GOOD / BAD / MISS
- **コンボシステム**: 連続でタップするとコンボボーナス！
- **ライフシステム**: ミスするとライフが減少
- **ランク評価**: S / A / B / C / D / E / F

## 🎹 操作方法

### キーボード
| キー | レーン |
|------|--------|
| A | 左端 (1) |
| S | (2) |
| D | (3) |
| F | (4) |
| Space | 中央 (5) |
| J | (6) |
| K | (7) |
| L | (8) |
| ; | 右端 (9) |
| Esc | 一時停止 |

### タッチ/マウス
- 画面の判定サークルを直接タップ/クリック
- マルチタッチ対応（同時押し可能）
- タイトル画面でダブルタップでフルスクリーン

## 🚀 プレイ方法

### GitHub Pages でプレイ
https://remmakoshino.github.io/rhythm-game/

### デプロイ
GitHub Actionsによる自動デプロイが設定されています。
`main`ブランチにプッシュすると自動的にGitHub Pagesにデプロイされます。

### ローカルでプレイ
1. リポジトリをクローン
   ```bash
   git clone https://github.com/remmakoshino/rhythm-game.git
   ```
2. `index.html` をブラウザで開く

または、VS Code の Live Server 拡張機能を使用

## 📁 プロジェクト構成

```
rhythm-game/
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions デプロイ設定
├── index.html          # メインHTML
├── css/
│   └── style.css       # スタイルシート
├── js/
│   ├── game.js         # ゲームロジック
│   └── songs.js        # 楽曲・譜面データ
├── sounds/             # 効果音（オプション）
└── README.md
```

## 🎵 収録楽曲

| 楽曲名 | アーティスト | BPM |
|--------|--------------|-----|
| Starlight Stage | Dream Idol Unit | 140 |
| Rainbow Dream | Prism Hearts | 160 |
| Eternal Melody | Celestial Voice | 128 |
| Miracle Flash | Sparkle Stars | 180 |
| Dancing Queen | Royal Crown | 150 |
| Love Confession | Heartbeat | 135 |
| Neon Lights | Electric Pulse | 175 |
| Cherry Blossom Dance | Spring Melody | 120 |

## 🛠️ カスタマイズ

### 楽曲の追加
`js/songs.js` に新しい楽曲を追加できます：

```javascript
{
    id: 'your_song',
    title: '楽曲タイトル',
    artist: 'アーティスト名',
    bpm: 150,
    icon: '🎵',
    duration: 60000, // ミリ秒
    charts: {
        easy: generateChart(150, 60000, 'easy'),
        normal: generateChart(150, 60000, 'normal'),
        hard: generateChart(150, 60000, 'hard'),
        expert: generateChart(150, 60000, 'expert')
    }
}
```

### 手動譜面作成
```javascript
{
    notes: [
        { time: 2000, lane: 4, type: 'tap' },
        { time: 2500, lane: 3, type: 'tap' },
        { time: 2500, lane: 5, type: 'tap' }, // 同時押し
        // ...
    ]
}
```

## 📱 対応環境

- Chrome / Firefox / Safari / Edge
- デスクトップ・モバイル対応
- タッチ操作対応

## 🎨 参考

- ラブライブ！スクールアイドルフェスティバル
- アイドルマスター シンデレラガールズ スターライトステージ

## 📄 ライセンス

MIT License

## 🙏 謝辞

このプロジェクトは、アイドル音楽ゲームへの愛を込めて作成されました。

---

Enjoy the rhythm! 🎶✨
