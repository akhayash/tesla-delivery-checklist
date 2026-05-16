import type { ChecklistTemplate } from './schema';

/**
 * Tesla Model Y L delivery checklist (v0.1 draft).
 *
 * 出典 / 参考:
 * - Tesla Model Y (Wikipedia) https://en.wikipedia.org/wiki/Tesla_Model_Y
 * - 一般的に Tesla オーナーコミュニティで挙げられる納車チェック観点を統合。
 *
 * 注意: 仕様は変更される可能性があります。実車の納車時には最新の公式情報も
 * 併せて確認してください。
 */
export const modelYLTemplate: ChecklistTemplate = {
  modelId: 'model-y-l',
  modelName: 'Tesla Model Y L',
  modelNameJa: 'Tesla Model Y L (ロングホイールベース 6 人乗り)',
  version: '0.1.0',
  releasedAt: '2025-08',
  market: '中国先行発売（2025 年中盤）',
  specs: {
    wheelbaseMm: 3040,
    lengthMm: 4976,
    widthMm: 1982,
    heightMm: 1668,
    curbWeightKg: 2088,
    seats: 6,
    drivetrain: 'デュアルモーター AWD',
    notes: [
      '標準 Model Y からホイールベースを 150 mm 延長',
      '2 列目はキャプテンシート × 2、3 列目を備える 2-2-2 配置',
      '車重は標準 Model Y より約 90 kg 重い',
    ],
  },
  categories: [
    {
      id: 'documents',
      title: '書類・基本情報',
      icon: 'FileText',
      items: [
        {
          id: 'doc.vin-match',
          title: 'VIN が注文書と一致',
          description: '車両のフロントガラス左下／運転席ドア開口部の VIN プレートと、Tesla アプリ・契約書の VIN が完全一致することを確認。',
          severity: 'critical',
        },
        {
          id: 'doc.registration',
          title: '車両登録証 / 一時抹消関連書類',
          description: '日本での登録時は車検証や納税証明、自賠責保険証の有無を確認。',
          severity: 'critical',
        },
        {
          id: 'doc.warranty',
          title: '保証書 (新車・バッテリー)',
          description: '電子保証の場合は Tesla アカウント上で確認可能か。',
          severity: 'major',
        },
        {
          id: 'doc.mobile-connector',
          title: 'モバイルコネクター / アダプター',
          description: '同梱されている充電ケーブルと家庭用 / 200V / 急速充電用アダプターの種類と数量を確認。',
          severity: 'major',
        },
        {
          id: 'doc.keycards',
          title: 'キーカード 2 枚',
          description: 'デフォルトで 2 枚同梱。紛失時の追加発行手順も確認しておく。',
          severity: 'major',
        },
        {
          id: 'doc.floormats',
          title: '同梱フロアマット',
          description: '注文書・パッケージリストに記載された枚数のフロアマットがそろっているか確認 (グレード・地域・オプションにより対象列が異なります)。',
          severity: 'minor',
        },
        {
          id: 'doc.manuals',
          title: '取扱説明書 (電子) へのアクセス',
          description: '車載スクリーンとモバイルアプリでマニュアルを開けるか。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'exterior',
      title: '外装 / ボディ',
      icon: 'Car',
      items: [
        {
          id: 'ext.panel-gaps',
          title: 'パネルギャップが左右対称',
          description: 'ボンネット・ドア・フェンダー・リアハッチの隙間を上下左右で比較。指の幅程度の差は要確認。',
          severity: 'major',
        },
        {
          id: 'ext.door-fit',
          title: 'ドアの建付け (4 枚)',
          description: '閉まり方、段差、ヒンジ音。Y L は後席ドアが標準 Y より長く重い。',
          severity: 'major',
        },
        {
          id: 'ext.paint',
          title: '塗装：傷・色ムラ・梨地・ピンホール',
          description: '太陽光または LED 直下で全パネルを目視。スマホのフラッシュをオンにして近接撮影すると微細欠陥を発見しやすい。',
          severity: 'major',
        },
        {
          id: 'ext.rear-hatch',
          title: 'リアハッチの開閉・段差・自動開閉',
          description: 'パワーリフトゲートの上下スピード、挟み込み防止、閉まり位置の段差。',
          severity: 'major',
        },
        {
          id: 'ext.bumpers',
          title: 'バンパー (前後) の取付・浮き',
          description: 'Y L はリアバンパー周りが長く、フィッターずれが起きやすいので要確認。',
          severity: 'major',
        },
        {
          id: 'ext.glass-roof',
          title: 'ガラスルーフ：傷・歪み・気泡',
          description: '内側・外側どちらも確認。後部座席側まで延びる長尺ガラスのため面積が大きい。',
          severity: 'major',
        },
        {
          id: 'ext.windshield',
          title: 'フロント／リアガラス：チップ・線傷',
          description: '輸送中のフライングストーンによるチップに注意。',
          severity: 'major',
        },
        {
          id: 'ext.lights',
          title: 'ヘッドライト／テールライト／ブレーキランプ：結露・点灯',
          description: 'ロー・ハイ・デイライト・ターン・ブレーキ・リバース・リアフォグまで一通り点灯確認。',
          severity: 'major',
        },
        {
          id: 'ext.charge-port',
          title: '充電ポート蓋の開閉動作',
          description: 'アプリと車内ボタン両方で開閉、ガコつきや戻りの遅れを確認。',
          severity: 'major',
        },
        {
          id: 'ext.wheels',
          title: 'ホイール：縁石傷・センターキャップ',
          description: '4 本のホイール全周。センターキャップとロゴの向きが揃っているか。',
          severity: 'minor',
        },
        {
          id: 'ext.tires',
          title: 'タイヤ：銘柄・サイズ・製造週・空気圧',
          description: '4 本同銘柄、サイドウォールの DOT 製造週コード、規定空気圧 (運転席ドア開口部のラベル) を確認。',
          severity: 'major',
        },
        {
          id: 'ext.door-handles',
          title: 'フラッシュドアハンドル',
          description: 'プッシュ式ハンドルの押し込み、戻り、左右で動作差がないか。',
          severity: 'minor',
        },
        {
          id: 'ext.mirrors',
          title: 'サイドミラー：格納・調整・ヒーター',
          description: '電動格納、上下左右調整、ヒーター動作。',
          severity: 'minor',
        },
        {
          id: 'ext.badges',
          title: 'エンブレム／バッジの位置・浮き',
          description: 'リアの「Model Y」「L」バッジが水平で浮きがないか。',
          severity: 'minor',
        },
        {
          id: 'ext.underside',
          title: '下回り・アンダーカバーの傷／緩み',
          description: '可能ならしゃがんで前後アンダーカバーを目視。フラッシュをオンにして撮影。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'interior-common',
      title: '内装 (共通)',
      icon: 'Armchair',
      items: [
        {
          id: 'int.steering',
          title: 'ステアリング：センター位置・ヒーター・スクロール',
          description: '直進時にセンターからずれていないか。スクロールホイール・ヒーターの動作。',
          severity: 'major',
        },
        {
          id: 'int.dashboard',
          title: 'ダッシュボードのトリム・軋み',
          description: '木目／アルミ調パネルの合わせ、走行前の静止状態で押して軋みを確認。',
          severity: 'minor',
        },
        {
          id: 'int.screen',
          title: '15.4 インチ中央スクリーン：傷・反応・コーティング',
          description: '画面の角・縁の傷、タッチ反応、コーティングの剥がれ。',
          severity: 'major',
        },
        {
          id: 'int.ambient',
          title: 'アンビエントライト / ドア内張りライト',
          description: '点灯色・明るさ・調整の追従。',
          severity: 'minor',
        },
        {
          id: 'int.dome-light',
          title: 'ドームライト：点灯・ドア連動',
          description: '前後席それぞれで点灯、タッチ操作、ドア開閉に連動して自然にオン／オフするか。',
          severity: 'minor',
        },
        {
          id: 'int.frunk',
          title: 'フランク：開閉・ライナー固定',
          description: '電動フランクの上下動作、内装ライナーの取付。',
          severity: 'major',
        },
        {
          id: 'int.trunk',
          title: 'ラゲッジ／電動トランク：開閉・トノカバー・12V/USB-C・サブトランク',
          description: '電動トランクの開閉、3 列目を畳んだ後の床の段差、サブトランクのカーペット固定。',
          severity: 'major',
        },
        {
          id: 'int.front-seats',
          title: '前席：電動調整・ヒーター・ベンチレーション',
          description: '前後／背もたれ／高さ／ランバー、ヒーターとベンチレーション (装備時)。',
          severity: 'major',
        },
        {
          id: 'int.audio',
          title: 'オーディオ：全スピーカーの音抜けチェック',
          description: 'YouTube Music などの音源で、バランス／フェーダーをまわしながら 1 スピーカーずつ音が出るか。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'interior-yl',
      title: '内装 (Model Y L 固有)',
      icon: 'Users',
      items: [
        {
          id: 'yl.row2-captain',
          title: '2 列目キャプテンシート × 2：スライド／リクライニング',
          description: 'スライド機構の引っ掛かり、リクライニング角度、左右シートの動作差。',
          severity: 'major',
        },
        {
          id: 'yl.row2-power',
          title: '2 列目シート：電動調整・ヒーター・ベンチレーション (装備時)',
          description: '装備グレードに応じて確認。電動なら前倒し動作のスムーズさも。',
          severity: 'major',
        },
        {
          id: 'yl.walkthrough',
          title: '2 列目間のウォークスルー通路',
          description: '通路にトリムの干渉や床マットのはみ出しがないか。',
          severity: 'minor',
        },
        {
          id: 'yl.row3-access',
          title: '3 列目へのアクセス機構',
          description: '2 列目の前倒しレバー／ボタン、復帰のしやすさ。',
          severity: 'major',
        },
        {
          id: 'yl.row3-seats',
          title: '3 列目シート：背もたれ角度・ヘッドルーム・固定',
          description: '大人が短時間座れるか、シートベルトのアンカー位置と巻取り。',
          severity: 'major',
        },
        {
          id: 'yl.rear-seat-fold',
          title: '後席シート：フラット収納・展開',
          description: '2 列目の前倒し・復帰、3 列目の格納／展開、ロックのかかり方と床のフラット感を確認。',
          severity: 'major',
        },
        {
          id: 'yl.row3-belts',
          title: '3 列目シートベルト × 2 の動作',
          description: 'バックル挿入・解除、テンショナー戻り。',
          severity: 'critical',
        },
        {
          id: 'yl.usb',
          title: '各列の USB-C ポート (通電・本数)',
          description: '前席・2 列目・3 列目すべての USB-C で給電できるか。',
          severity: 'minor',
        },
        {
          id: 'yl.rear-hvac',
          title: '後席エアコン吹き出し口 / 後席タッチパネル',
          description: '吹出口の角度、流量、後席用タッチパネル (装備時) の反応。',
          severity: 'major',
        },
        {
          id: 'yl.cargo-with-3rd',
          title: '3 列目使用時のラゲッジ容量・床段差',
          description: '3 列目を立てた状態で標準カーゴ容量があるか、フックやネットの位置。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'function',
      title: '機能 / 電装',
      icon: 'Zap',
      items: [
        {
          id: 'fn.no-warning',
          title: '12V／補機バッテリー：警告灯なし',
          description: 'メーター画面に警告灯／メッセージが残っていないか。',
          severity: 'critical',
        },
        {
          id: 'fn.wipers',
          title: 'ワイパー：間欠・連続・ウォッシャー噴霧',
          description: 'ウォッシャー液の出方、左右ノズルの噴射位置、自動ワイパー (オートウェット) の反応。',
          severity: 'major',
        },
        {
          id: 'fn.windows',
          title: '全ウィンドウ：オート開閉・挟み込み防止',
          description: '4 枚すべてオート開閉、紙片で挟み込み防止が効くか確認。',
          severity: 'major',
        },
        {
          id: 'fn.headlights',
          title: 'ヘッドライト：ロー/ハイ/オートハイビーム',
          description: '夜間または暗所で点灯モードを切替。',
          severity: 'major',
        },
        {
          id: 'fn.signals',
          title: 'ターンシグナル／ハザード',
          description: '左右ウインカー、ハザード、ステアリングのスクロールボタン操作。',
          severity: 'major',
        },
        {
          id: 'fn.horn',
          title: 'ホーン',
          description: '一度短く鳴らして音質に違和感がないか。',
          severity: 'minor',
        },
        {
          id: 'fn.seatbelts',
          title: '全席シートベルト：着脱・警告表示',
          description: '1〜3 列すべてでバックル挿入・解除、巻取り、着座検知と警告表示／警告音を確認。',
          severity: 'critical',
        },
        {
          id: 'fn.hvac',
          title: 'HVAC：冷房・暖房・HEPA・除湿',
          description: '冷えと暖まりの速さ、ファン段階、Bioweapon Defense Mode (装備時) の起動。',
          severity: 'major',
        },
        {
          id: 'fn.heated-steering',
          title: 'ステアリングヒーター',
          description: '触れて十分に暖まるか。',
          severity: 'minor',
        },
        {
          id: 'fn.voice-nav',
          title: 'ナビ／音声認識：目的地設定',
          description: '住所や施設名を話して認識できるか、候補選択からナビ開始まで操作できるか。',
          severity: 'minor',
        },
        {
          id: 'fn.cameras',
          title: 'カメラ：8 方位映像の歪み／汚れ',
          description: '全カメラ画像をスクリーンで確認、汚れや内部結露がないか。',
          severity: 'major',
        },
        {
          id: 'fn.sensors',
          title: 'パーキングセンサー (Tesla Vision) ／ Autopark',
          description: '駐車場で 1 マス分の動作テスト。',
          severity: 'major',
        },
        {
          id: 'fn.autopilot-cal',
          title: 'Autopilot キャリブレーション完走',
          description: '納車後、安全な道で数 km の走行が必要。納車時点では未完でも OK。',
          severity: 'minor',
        },
        {
          id: 'fn.supercharger',
          title: 'スーパーチャージャー試し充電',
          description: '充電開始、最大電流、充電カーブ、車載画面の表示確認。',
          severity: 'major',
        },
        {
          id: 'fn.sentry-dogmode',
          title: 'Sentry Mode / Dog Mode / Camp Mode',
          description: 'すべて起動できるか、カメラ映像が正常に保存されるか。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'software',
      title: 'ソフトウェア / アカウント',
      icon: 'Smartphone',
      items: [
        {
          id: 'sw.account',
          title: 'Tesla アカウント紐付け (オーナー権限)',
          description: 'アプリで Owner として表示されているか。',
          severity: 'critical',
        },
        {
          id: 'sw.phone-key',
          title: 'スマホキー登録 (家族分含む)',
          description: '家族の端末を Driver として追加できる手順を確認。',
          severity: 'major',
        },
        {
          id: 'sw.fw-version',
          title: 'ソフトウェアバージョンを記録',
          description: '「サービス → ソフトウェア」から控える。',
          severity: 'minor',
        },
        {
          id: 'sw.connectivity',
          title: 'Premium Connectivity / 標準コネクティビティ',
          description: '契約状況を確認、ストリーミングや衛星マップが使えるか。',
          severity: 'minor',
        },
        {
          id: 'sw.locale',
          title: '言語 / 地域 / 単位設定',
          description: '日本語 UI、距離 km、時刻 24h など。',
          severity: 'minor',
        },
        {
          id: 'sw.fsd-eap',
          title: 'FSD / EAP オプションの有効化状況',
          description: '購入オプションが反映されているか確認。',
          severity: 'major',
        },
      ],
    },
    {
      id: 'aftercare',
      title: 'アフター対応',
      icon: 'BadgeCheck',
      items: [
        {
          id: 'af.due-bill',
          title: 'Due Bill (未対応事項の書面化)',
          description: '納車時点で気付いた問題が、Tesla の修正リストに書面で残っているか。',
          severity: 'critical',
        },
        {
          id: 'af.service-appt',
          title: 'サービスアポイント予約手順の確認',
          description: 'アプリ経由・電話・モバイルサービスの呼び方を理解。',
          severity: 'major',
        },
        {
          id: 'af.return-policy',
          title: 'リターンポリシー (国・地域による)',
          description: '日本では適用外の場合あり。最新の規約を確認。',
          severity: 'minor',
        },
      ],
    },
  ],
};
