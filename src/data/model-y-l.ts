import type { ChecklistTemplate } from './schema';

/**
 * Tesla Model Y L delivery checklist (v0.3).
 *
 * 出典 / 参考:
 * - Tesla Model Y L 公式スペック (中国市場) https://www.tesla.com/zh_CN/modely
 * - Tesla オーナーズマニュアル (車載スクリーン / Tesla 公式サイト)
 * - Tesla Motors Club / Reddit r/TeslaModelY 納車レポートまとめ
 * - Wikipedia: Tesla Model Y https://en.wikipedia.org/wiki/Tesla_Model_Y
 * - 国内 Tesla オーナーコミュニティ「納車時の見逃しトップ 10」集計
 *
 * v0.3 変更点:
 * - パネルフラッシュネス・ウェザーストリップ・フレーム整合など頻出トラブル項目を追加
 * - 全席シートベルト確認・音声ナビ確認を機能テストに追加
 * - 後席エンタメスクリーン・後席シートフラット収納確認を追加
 * - 内装の臭い確認・ドームライト確認を追加
 * - 写真撮影記録を引き渡し後対応に追加
 *
 * 注意: 仕様は変更される可能性があります。実車の納車時には最新の公式情報も
 * 併せてご確認ください。
 */
export const modelYLTemplate: ChecklistTemplate = {
  modelId: 'model-y-l',
  modelName: 'Tesla Model Y L',
  modelNameJa: 'Tesla Model Y L (ロングホイールベース 6 人乗り)',
  version: '0.3.0',
  releasedAt: '2026-05',
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
      id: 'step-1-handoff',
      title: '1. 書類・引き渡し前の確認',
      icon: 'FileText',
      locationHint:
        'デリバリーラウンジや車両の前で、アプリ・注文書・同梱品をまとめて確認。',
      items: [
        {
          id: 'doc.vin-match',
          title: 'VIN が注文書 / Tesla アプリ / 車体表示と一致',
          description:
            'フロントガラス左下や運転席ドア開口部の VIN と、Tesla アプリ・契約書の VIN が完全一致することを確認。',
          severity: 'critical',
        },
        {
          id: 'doc.plate-match',
          title: 'ナンバープレート情報が引き渡し書類と一致',
          description:
            '登録番号、封印前の案内、仮ナンバーや地域名などに相違がないかを確認。',
          severity: 'critical',
        },
        {
          id: 'doc.registration',
          title: '車検証 / 自賠責証明書がグローブボックスに常備されている',
          description:
            '日本では車検証 (2023 年以降は電子車検証 IC カード) と自賠責保険証明書を物理的に車内 (グローブボックス) に常時携帯することが法律で義務 (道路運送車両法第 66 条)。デジタルのみの納車は不可。中国仕様では行驶证 (運転証) が車内、机动车登记证书 (緑本) は自宅保管。VIN・所有者氏名・住所が注文書と一致するか確認。',
          severity: 'critical',
        },
        {
          id: 'doc.warranty',
          title: '保証内容 (新車 / バッテリー) を確認',
          description:
            '電子保証の場合は Tesla アカウント上で確認可能か。',
          severity: 'major',
        },
        {
          id: 'doc.keycards',
          title: 'キーカード 2 枚が同梱されている',
          description:
            'デフォルトで 2 枚同梱。紛失時の追加発行手順も確認しておく。',
          severity: 'major',
        },
        {
          id: 'doc.mobile-connector',
          title: 'モバイルコネクター / 充電アダプター (購入時のみ)',
          description:
            'モバイルコネクターは Model Y L 中国仕様では標準付属ではない (別売)。注文時にオプション購入していた場合のみ同梱を確認。同梱されている場合は GB/T 規格のケーブルとアダプター類が揃っているか確認。',
          severity: 'major',
        },
        {
          id: 'doc.floormats',
          title: 'フロアマット (1・2 列目のみ、3 列目はない)',
          description:
            '前列・2 列目用マットの有無を確認。3 列目用マットは付属しない仕様。マット類は中国 Tesla では別売アクセサリーが基本のため、注文書記載の枚数と実物を必ず照合する。',
          severity: 'minor',
        },
        {
          id: 'doc.manuals',
          title: '取扱説明書 (電子) へアクセスできる',
          description:
            '車載スクリーンとモバイルアプリでマニュアルを開けるか。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'step-2-walkaround',
      title: '2. 外装ウォークアラウンド (フロント → 右サイド → リア → 左サイド)',
      icon: 'Car',
      locationHint:
        '車の前に立ってから時計回りに一周。フロント → 右サイド → リア → 左サイドの順で見ると見落としにくいです。',
      items: [
        {
          id: 'ext.lights',
          title: 'ライト類：ヘッドライト / テールライトの点灯・結露',
          description:
            'ロー・ハイ・デイライト・ターン・ブレーキ・リバース・リアフォグまで一通り点灯確認。',
          severity: 'major',
        },
        {
          id: 'ext.bumpers',
          title: 'バンパー (フロント / リア) の取付・浮き',
          description:
            'Y L はリアバンパー周りが長く、フィッターずれが起きやすいので要確認。',
          severity: 'major',
        },
        {
          id: 'ext.windshield',
          title: 'フロント / リアガラス：チップ・線傷',
          description:
            '輸送中のフライングストーンによるチップに注意。',
          severity: 'major',
        },
        {
          id: 'int.frunk',
          title: 'フランク：開閉・ライナー固定',
          description:
            '電動フランクの上下動作、内装ライナーの取付を確認。',
          severity: 'major',
        },
        {
          id: 'ext.door-handles',
          title: 'ドアハンドル 4 枚：押し込み・戻り',
          description:
            'プッシュ式ハンドルの押し込み、戻り、左右で動作差がないか。',
          severity: 'minor',
        },
        {
          id: 'ext.door-fit',
          title: '右前 / 右後 / 左前 / 左後ドアの建付け',
          description:
            '閉まり方、段差、ヒンジ音。Y L は後席ドアが標準 Y より長く重い。',
          severity: 'major',
        },
        {
          id: 'ext.wheels',
          title: 'ホイール 4 本：縁石傷・センターキャップ',
          description:
            '4 本のホイール全周。センターキャップとロゴの向きが揃っているか。',
          severity: 'minor',
        },
        {
          id: 'ext.tires',
          title: 'タイヤ 4 本：銘柄・サイズ・製造週・空気圧',
          description:
            '4 本同銘柄、サイドウォールの DOT 製造週コード、規定空気圧を確認。',
          severity: 'major',
        },
        {
          id: 'ext.mirrors',
          title: '左右サイドミラー：格納・調整・ヒーター',
          description:
            '電動格納、上下左右調整、ヒーター動作。',
          severity: 'minor',
        },
        {
          id: 'ext.panel-gaps',
          title: '左右サイドのパネルギャップが大きくずれていない',
          description:
            'ボンネット・ドア・フェンダー・リアハッチの隙間を上下左右で比較。',
          severity: 'major',
        },
        {
          id: 'ext.panel-flush',
          title: 'パネル面の揃い (フラッシュネス)',
          description:
            'ドア・フェンダー・ボンネット・リアハッチの継ぎ目で、隣接パネルが同一平面上にあるか横から目視。0.5 mm 以上の凹凸は要確認。光を当てて影で判断するとわかりやすい。',
          severity: 'major',
        },
        {
          id: 'ext.weatherstrip',
          title: 'ウェザーストリップ (ドアシール) の固定・はがれ',
          description:
            'ドア 4 枚・リアハッチ・フランクのゴムシールが全周にわたって均一に圧着されているか指で押して確認。剥がれ・浮き・切れ目・接着剤のはみ出しがないか。',
          severity: 'major',
        },
        {
          id: 'ext.frame-alignment',
          title: 'フレーム・ピラー整合 (対角線チェック)',
          description:
            'ドア開口部の対角線 (左上と右下、右上と左下) をメジャーで計測し、差が 5 mm 以内であることを確認。大きなずれはフレーム歪みの可能性があり最重要欠陥。',
          severity: 'critical',
        },
        {
          id: 'ext.paint',
          title: '左右サイドの塗装：傷・色ムラ・ピンホール',
          description:
            '太陽光または LED 直下で全パネルを目視。スマホのフラッシュを使うと微細欠陥を見つけやすい。',
          severity: 'major',
        },
        {
          id: 'ext.rear-hatch',
          title: 'リアハッチの開閉・段差・自動開閉',
          description:
            'パワーリフトゲートの上下スピード、挟み込み防止、閉まり位置の段差。',
          severity: 'major',
        },
        {
          id: 'ext.badges',
          title: 'エンブレム / バッジの位置・浮き',
          description:
            'リアの「Model Y」「L」バッジが水平で浮きがないか。',
          severity: 'minor',
        },
        {
          id: 'ext.glass-roof',
          title: 'ガラスルーフ後端・外装ガラス：傷・歪み・気泡',
          description:
            '後席側まで延びる長尺ガラスのため、後端や端部の歪みも目視。',
          severity: 'major',
        },
        {
          id: 'ext.charge-port',
          title: '充電ポート蓋の開閉動作',
          description:
            'アプリと車内ボタン両方で開閉し、ガコつきや戻りの遅れを確認。',
          severity: 'major',
        },
        {
          id: 'ext.underside',
          title: '下回り・アンダーカバーの傷 / 緩み',
          description:
            '可能ならしゃがんで前後アンダーカバーを目視。フラッシュをオンにして撮影。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'step-3-pre-boarding',
      title: '3. 乗り込み前 (室内ぐるり)',
      icon: 'Armchair',
      locationHint:
        'まず前席まわりを一周。運転席 → 助手席の順で座り心地と操作系を確認。',
      items: [
        {
          id: 'int.front-seats',
          title: '運転席 / 助手席：電動調整・ヒーター・ベンチレーション',
          description:
            '前後／背もたれ／高さ／ランバー、ヒーターとベンチレーション (装備時)。',
          severity: 'major',
        },
        {
          id: 'int.steering',
          title: '運転席：ステアリング・スクロール・センター位置',
          description:
            '直進時にセンターからずれていないか。スクロールホイール・ヒーターの動作も確認。',
          severity: 'major',
        },
        {
          id: 'int.pedals',
          title: '運転席：アクセル / ブレーキペダルの違和感がない',
          description:
            '踏み込み時の引っかかり、戻り、マット干渉がないかをチェック。',
          severity: 'critical',
        },
        {
          id: 'int.screen',
          title: '15.4 インチ中央スクリーン：傷・反応・コーティング',
          description:
            '画面の角・縁の傷、タッチ反応、コーティングの剥がれ。',
          severity: 'major',
        },
        {
          id: 'int.dashboard',
          title: '助手席側ダッシュトリム / 前席トリムの合わせ',
          description:
            '木目／アルミ調パネルの合わせ、静止状態で押して軋みを確認。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'step-4-row2',
      title: '4. 2 列目 (左キャプテン → 右キャプテン)',
      icon: 'Users',
      locationHint:
        '左キャプテンシートから順番に座り、スライド・リクライニング・快適装備を左右で比較。',
      items: [
        {
          id: 'yl.row2-captain',
          title: '2 列目キャプテンシート × 2：スライド / リクライニング',
          description:
            'スライド機構の引っ掛かり、リクライニング角度、左右シートの動作差。',
          severity: 'major',
        },
        {
          id: 'yl.row2-power',
          title: '2 列目シート：ヒーター・ベンチレーション・前倒し動作',
          description:
            '装備グレードに応じて確認。電動なら前倒し動作のスムーズさも見る。',
          severity: 'major',
        },
        {
          id: 'yl.rear-hvac',
          title: '後席エアコン吹き出し口 / 後席タッチパネル',
          description:
            '吹出口の角度、流量、後席用タッチパネル (装備時) の反応。',
          severity: 'major',
        },
        {
          id: 'yl.rear-entertainment',
          title: '後席エンタメスクリーン (装備グレードのみ)',
          description:
            '後席センターコンソール上のタッチスクリーン (装備グレード) でビデオ再生・音量調整・エアコン操作ができるか確認。グレードにより未装備の場合は該当なし (対象外) でチェック。',
          severity: 'minor',
          applicableTo: ['Performance'],
        },
        {
          id: 'yl.usb',
          title: '2 列目 / 3 列目 USB-C ポートの通電と本数',
          description:
            '前席・2 列目・3 列目すべての USB-C で給電できるか。',
          severity: 'minor',
        },
        {
          id: 'yl.walkthrough',
          title: '2 列目間のウォークスルー通路',
          description:
            '通路にトリムの干渉や床マットのはみ出しがないか。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'step-5-row3',
      title: '5. 3 列目アクセス & 3 列目シート',
      icon: 'Users',
      locationHint:
        '2 列目を前倒しして 3 列目へ。出入りのしやすさとシートベルト周りを重点確認。',
      items: [
        {
          id: 'yl.row3-access',
          title: '3 列目へのアクセス機構',
          description:
            '2 列目の前倒しレバー／ボタン、復帰のしやすさ。',
          severity: 'major',
        },
        {
          id: 'yl.row3-seats',
          title: '3 列目シート：背もたれ角度・ヘッドルーム・固定',
          description:
            '大人が短時間座れるか、固定やガタつきも確認。',
          severity: 'major',
        },
        {
          id: 'yl.rear-seat-fold',
          title: '後席シート：フラット収納・展開',
          description:
            '2 列目の前倒し・復帰、3 列目の格納／展開、ロックのかかり方と床のフラット感を確認。',
          severity: 'major',
        },
        {
          id: 'yl.row3-belts',
          title: '3 列目シートベルト × 2 の動作',
          description:
            'バックル挿入・解除、テンショナー戻り。',
          severity: 'critical',
        },
        {
          id: 'yl.cargo-with-3rd',
          title: '3 列目使用時のラゲッジ容量・床段差',
          description:
            '3 列目を立てた状態で標準カーゴ容量があるか、フックやネットの位置。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'step-6-cabin',
      title: '6. 室内全体',
      icon: 'Armchair',
      locationHint:
        '全席を見渡しながら上から下へ。ガラスルーフ内側、照明、空調、荷室をまとめて確認。',
      items: [
        {
          id: 'int.glass-roof-inner',
          title: 'ガラスルーフ内側：汚れ・曇り・内装浮き',
          description:
            '内張りとの境目、シール材のはみ出し、内側から見た歪みを確認。',
          severity: 'major',
        },
        {
          id: 'int.ambient',
          title: 'アンビエントライト / ドア内張りライト',
          description:
            '点灯色・明るさ・調整の追従。',
          severity: 'minor',
        },
        {
          id: 'int.audio',
          title: 'オーディオ：全スピーカーの音抜けチェック',
          description:
            'バランス／フェーダーをまわして 1 スピーカーずつ音が出るか。',
          severity: 'minor',
        },
        {
          id: 'int.odor',
          title: '内装の異臭・タバコ臭・接着剤臭',
          description:
            '車内に乗り込んで強い接着剤臭・塗料臭・タバコ臭がないか確認。工場出荷直後は多少の揮発臭があるが、刺激臭が強い場合は要確認。',
          severity: 'minor',
        },
        {
          id: 'int.dome-light',
          title: 'ドームライト：点灯・ドア連動',
          description:
            '前後席それぞれで点灯、タッチ操作、ドア開閉に連動して自然にオン／オフするか。',
          severity: 'minor',
        },
        {
          id: 'fn.hvac',
          title: 'HVAC：冷房・暖房・HEPA・除湿',
          description:
            '冷えと暖まりの速さ、ファン段階、Bioweapon Defense Mode (装備時) の起動。',
          severity: 'major',
        },
        {
          id: 'fn.heated-steering',
          title: 'ステアリングヒーター',
          description:
            '触れて十分に暖まるか。',
          severity: 'minor',
        },
        {
          id: 'int.trunk',
          title: 'ラゲッジ：トノカバー・12V/USB-C・サブトランク',
          description:
            '3 列目を畳んだ後の床の段差、サブトランクのカーペット固定。',
          severity: 'major',
        },
      ],
    },
    {
      id: 'step-7-functions',
      title: '7. 機能テスト (運転席に戻って)',
      icon: 'Zap',
      locationHint:
        '運転席へ戻り、スクリーン操作と各スイッチを順番にチェック。停車状態でできる項目を先に終わらせます。',
      items: [
        {
          id: 'fn.no-warning',
          title: '12V / 補機バッテリーやシステム警告が残っていない',
          description:
            'メッセージ一覧や通知バナーに異常表示が残っていないか。',
          severity: 'critical',
        },
        {
          id: 'fn.wipers',
          title: 'ワイパー：間欠・連続・ウォッシャー噴霧',
          description:
            'ウォッシャー液の出方、左右ノズルの噴射位置、自動ワイパーの反応。',
          severity: 'major',
        },
        {
          id: 'fn.windows',
          title: '全ウィンドウ：オート開閉・挟み込み防止',
          description:
            '4 枚すべてオート開閉し、異音や途中停止がないか確認。',
          severity: 'major',
        },
        {
          id: 'fn.seatbelts',
          title: '全席シートベルト：着脱・警告表示',
          description:
            '1〜3 列すべてでバックル挿入・解除、巻取り、着座検知と警告表示／警告音を確認。',
          severity: 'critical',
        },
        {
          id: 'fn.signals',
          title: 'ターンシグナル / ハザード',
          description:
            '左右ウインカー、ハザード、ステアリングボタン操作。',
          severity: 'major',
        },
        {
          id: 'fn.horn',
          title: 'ホーン',
          description:
            '一度短く鳴らして音質に違和感がないか。',
          severity: 'minor',
        },
        {
          id: 'fn.cameras',
          title: 'カメラ：8 方位映像の歪み / 汚れ',
          description:
            '全カメラ画像をスクリーンで確認し、汚れや内部結露がないか。',
          severity: 'major',
        },
        {
          id: 'fn.sensors',
          title: 'パーキングセンサー (Tesla Vision) / Autopark',
          description:
            '駐車場で 1 マス分の動作テスト。',
          severity: 'major',
        },
        {
          id: 'fn.autopilot-cal',
          title: 'Autopilot キャリブレーションの進み具合を確認',
          description:
            '納車後、安全な道で数 km の走行が必要。納車時点では未完でも OK。',
          severity: 'minor',
        },
        {
          id: 'fn.voice-nav',
          title: 'ナビ／音声認識：目的地設定',
          description:
            '住所や施設名を話して認識できるか、候補選択からナビ開始まで操作できるか。',
          severity: 'minor',
        },
        {
          id: 'fn.sentry-dogmode',
          title: 'Sentry Mode / Dog Mode / Camp Mode',
          description:
            'すべて起動できるか、カメラ映像が正常に保存されるか。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'step-8-test-drive',
      title: '8. 試走 & スーパーチャージャー',
      icon: 'Zap',
      locationHint:
        '短い試走で直進性と回生を確認し、時間が許せば近くの Supercharger で数分だけ試し充電。',
      items: [
        {
          id: 'fn.drive-feel',
          title: '走行違和感・回生ブレーキ・直進安定性',
          description:
            '低速でのきしみ、異音、ハンドルセンター、回生のつながり方を確認。',
          severity: 'major',
        },
        {
          id: 'fn.supercharger',
          title: 'スーパーチャージャー試し充電',
          description:
            '充電開始、最大電流、充電カーブ、車載画面の表示確認。',
          severity: 'major',
        },
      ],
    },
    {
      id: 'step-9-software',
      title: '9. ソフトウェア / アカウント',
      icon: 'Smartphone',
      locationHint:
        '納車担当と一緒にアプリと車載画面を見ながら、権限・キー・契約オプションを最終確認。',
      items: [
        {
          id: 'sw.account',
          title: 'Tesla アカウント紐付け (オーナー権限)',
          description:
            'アプリで Owner として表示されているか。',
          severity: 'critical',
        },
        {
          id: 'sw.phone-key',
          title: 'スマホキー登録 (家族分含む)',
          description:
            '家族の端末を Driver として追加できる手順を確認。',
          severity: 'major',
        },
        {
          id: 'sw.fw-version',
          title: 'ソフトウェアバージョンを記録',
          description:
            '「サービス → ソフトウェア」から控える。',
          severity: 'minor',
        },
        {
          id: 'sw.fsd-eap',
          title: 'FSD / EAP オプションの有効化状況',
          description:
            '購入オプションが反映されているか確認。',
          severity: 'major',
        },
        {
          id: 'sw.locale',
          title: '言語 / 地域 / 単位設定',
          description:
            '日本語 UI、距離 km、時刻 24h など。',
          severity: 'minor',
        },
        {
          id: 'sw.connectivity',
          title: 'Premium Connectivity / 標準コネクティビティ',
          description:
            '契約状況を確認し、ストリーミングや衛星マップが使えるか。',
          severity: 'minor',
        },
      ],
    },
    {
      id: 'step-10-aftercare',
      title: '10. 引き渡し後対応',
      icon: 'BadgeCheck',
      locationHint:
        '気になる点はその場で書面化し、帰宅後に慌てないようサポート窓口と次の動きを確認。',
      items: [
        {
          id: 'af.due-bill',
          title: 'Due Bill (未対応事項の書面化)',
          description:
            '納車時点で気付いた問題が、Tesla の修正リストに書面で残っているか。',
          severity: 'critical',
        },
        {
          id: 'af.photos',
          title: '全体・問題箇所の写真を撮影・保存',
          description:
            '納車時の外観・内観・メーター・書類をすべて撮影しておく。後日の保証申請・修理時の証拠になる。このアプリの写真添付機能を活用。',
          severity: 'major',
        },
        {
          id: 'af.service-appt',
          title: 'サービスアポイント予約手順の確認',
          description:
            'アプリ経由・電話・モバイルサービスの呼び方を理解。',
          severity: 'major',
        },
        {
          id: 'af.return-policy',
          title: 'リターンポリシー (国・地域による)',
          description:
            '日本では適用外の場合あり。最新の規約を確認。',
          severity: 'minor',
        },
      ],
    },
  ],
};
