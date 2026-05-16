import type { ChecklistTemplate } from './schema';

/**
 * Tesla Model Y L delivery checklist (v0.4).
 *
 * 出典 / 参考:
 * - Tesla Model Y L 公式スペック https://www.tesla.com/modely
 * - Tesla オーナーズマニュアル (車載スクリーン / Tesla 公式サイト)
 * - Tesla Motors Club / Reddit r/TeslaModelY 納車レポートまとめ
 * - Wikipedia: Tesla Model Y https://en.wikipedia.org/wiki/Tesla_Model_Y
 * - 国内 Tesla オーナーコミュニティ「納車時の見逃しトップ 10」集計
 *
 * v0.4 変更点:
 * - yl.row3-belts を削除し fn.seatbelts の説明を全 6 席対応に拡張
 * - doc.warranty / ext.wheel-covers を critical に格上げ
 * - int.odor / af.return-policy / fn.horn を major に格上げ
 * - fn.hvac / fn.heated-steering を step-6-cabin から step-7-functions へ移動
 * - int.steering に step-7 クロスリファレンスを追加
 * - 新規 7 項目追加: fn.12v-battery-health, int.headliner-trim, ext.tire-dot-date,
 *   fn.sentry-usb, fn.steering-pull-alignment, int.cabin-air-filter, fn.wireless-charging
 * - 中国市場固有の記述を除去し、グローバル中立な内容に整理
 *
 * 注意: 仕様は変更される可能性があります。実車の納車時には最新の公式情報も
 * 併せてご確認ください。
 */
export const modelYLTemplate: ChecklistTemplate = {
  modelId: 'model-y-l',
  modelName: 'Tesla Model Y L',
  modelNameJa: 'Tesla Model Y L (ロングホイールベース 6 人乗り)',
  version: '0.4.0',
  releasedAt: '2026-05',
  market: '2025 年発売',
  specs: {
    wheelbaseMm: 3040,
    lengthMm: 4976,
    widthMm: 1920,
    heightMm: 1668,
    curbWeightKg: 2088,
    seats: 6,
    drivetrain: 'デュアルモーター AWD',
    notes: [
      '標準 Model Y からホイールベースを 150 mm 延長',
      '2 列目はキャプテンシート × 2、3 列目を備える 2-2-2 配置',
      '車重は標準 Model Y より約 90 kg 重い',
      '車体幅 1,920 mm (ミラー折畳時 1,982 mm / ミラー展開時 2,129 mm)',
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
            'フロントガラス左下、運転席ドア開口部 (B ピラー)、フランク内ラベル、車載スクリーンの Controls ▸ Software ▸ 車両情報、Tesla アプリ、注文書のすべての VIN が完全一致することを確認。',
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
            '車検証 (2023 年以降は電子車検証 IC カード) と自賠責保険証明書が車内 (グローブボックス) に常備されているか確認。道路運送車両法第 66 条で常時携帯が義務付けられており、デジタル管理のみは不可。電子車検証は IC カードのみだと現場では内容を確認できないため、納車担当に専用リーダーまたは「車検証閲覧アプリ」での読み取りを依頼し、VIN・所有者氏名・住所が注文書と一致するかその場で確認すること。',
          severity: 'critical',
        },
        {
          id: 'doc.warranty',
          title: '保証内容 (新車 / バッテリー) の確認',
          description:
            '基本保証は 4 年 / 8 万 km、駆動系・バッテリーは 8 年 / 19.2 万 km (容量保証 70%)。Tesla アカウントで電子確認できるか、紙の保証書類が同梱されているかも確認。',
          severity: 'critical',
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
            'モバイルコネクターは Model Y L の標準付属ではない (別売)。注文時にオプション購入していた場合のみ同梱を確認。同梱されている場合はケーブル本体とアダプター類が注文どおりに揃っているか確認。',
          severity: 'major',
        },
        {
          id: 'doc.floormats',
          title: 'フロアマット (1・2 列目のみ、3 列目はない)',
          description:
            '前列・2 列目用マットの有無を確認。3 列目用マットは付属しない仕様。マット類は別売アクセサリー扱いの場合があるため、注文書記載の枚数と実物を必ず照合する。',
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
      title: '2. 外装ウォークアラウンド (フロント ▸ 右サイド ▸ リア ▸ 左サイド)',
      icon: 'Car',
      locationHint:
        '車の前に立ってから時計回りに一周。フロント ▸ 右サイド ▸ リア ▸ 左サイドの順で見ると見落としにくいです。',
      items: [
        {
          id: 'ext.lights',
          title: 'ライト類：ヘッドライト / テールライトの点灯・結露',
          description:
            'ロー・ハイ・デイライト・ターン・ブレーキ・リバース・リアフォグまでひと通り点灯確認。さらにヘッドライト・テールライト内部の結露・曇り (condensation) の有無を念入りに確認すること。Tesla Motors Club と Reddit r/TeslaModelY で頻出する既知不具合で、納車後に発見すると「使用環境による」と判断されて保証対応が長引きがち。少しでも曇りがあればその場で写真・動画を撮影し Due Bill に記載してもらう。',
          severity: 'major',
        },
        {
          id: 'ext.bumpers',
          title: 'バンパー (フロント / リア) の取付・浮き',
          description:
            'ドアシャットラインを基準に、リアバンパー上端とクォーターパネルの段差・左右隙間差を確認。段差 3 mm 以上、左右差 2 mm 超は要修正の目安。TMC/Reddit で納車直後のずれ報告が多く、必ずその場で写真を撮って Due Bill に記載。',
          severity: 'major',
        },
        {
          id: 'ext.windshield',
          title: 'フロント / リアガラス：チップ・線傷',
          description:
            '輸送中のフライングストーンによるチップに注意。Juniper 以降は全窓に二層遮音ガラス (acoustic) を採用。工場出荷時のダッシュカムは搭載されておらず、Sentry Mode が車載 8 カメラで録画を行います。',
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
            '4 本のホイール全周を確認し、縁石傷の有無を撮影。センターキャップの Tesla T ロゴは 12 時位置に揃えると見栄えが整う。ロゴ向きはキャップを手で軽く回して調整可能（機能影響なし）なので、納車時にまとめて合わせ、基準写真を残しておく。',
          severity: 'minor',
        },
        {
          id: 'ext.wheel-covers',
          title: 'エアロホイールカバー 4 本：完全に嵌まっている',
          description:
            '19 インチホイールはエアロカバー装着。納車後の走行で外れて紛失する事例あり (オーナー報告)。各カバーの全周クリップが浮きなく完全に嵌まっているか、押し込んでカチッと固定されているかを 4 本すべて確認。',
          severity: 'critical',
        },
        {
          id: 'ext.tires',
          title: 'タイヤ：スタッガード仕様 (前 255/45R19・後 275/45R19)',
          description:
            'Model Y L は前後で異なる幅のスタッガード仕様。前 255/45R19 / 後 275/45R19 が正しい配置か、左右で銘柄が同一かを確認。前後ローテーション不可。',
          severity: 'major',
        },
        {
          id: 'ext.tire-dot-date',
          title: 'タイヤ製造日 (DOT コード) が納車日から 26 週以内',
          description:
            '各タイヤのサイドウォールに刻印された DOT コードの末尾 4 桁 (例: 4024 = 2024 年第 40 週製造) を読み取り、納車日から逆算して 26 週 (約 6 カ月) 以内の製造かを確認。在庫として長期保管されたタイヤは劣化している可能性がある。4 本すべてを確認。所要 2 分。',
          severity: 'critical',
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
            'ボンネット・ドア・フェンダー・リアハッチの隙間を上下左右で比較。Tesla 公式の数値基準は非公開。コミュニティ目安は同一パネル内で 1 mm 以上の差が要対応、2 mm 以上は明確な欠陥。名刺 (約 0.8 mm) をゲージにすると判定しやすい。',
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
          title: 'フレーム・ピラー整合 (対角線チェック・オーナー実施)',
          description:
            '4 枚のドア開口部それぞれで、対角線 (左上⇄右下、右上⇄左下) を金属メジャーで計測し、左右の差が 5 mm 以内か確認。計測点はドア開口部の角 (ウェザーストリップの内側、ピラーとシルが交わるコーナー部) を左右同じ位置に揃えるのがコツ。Tesla の納車プロセスにはこの計測は含まれないため、オーナー自身または第三者の納車検査サービスが実施する。差が 5 mm を超える場合はフレーム歪みの可能性があり、最重要欠陥として写真記録した上で受領前に必ず指摘すること。',
          severity: 'critical',
        },
        {
          id: 'ext.paint',
          title: '左右サイドの塗装：傷・色ムラ・ピンホール',
          description:
            '太陽光または強い LED を斜め 45° から当て、orange peel に加えて dust nibs（ブツ）、sanding marks（研磨跡）、paint runs（垂れ）を面ごとに確認。TMC/Reddit で頻出。指先で凹凸を感じたら写真・動画を撮り、受領前に Due Bill へ記載。',
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
        'まず前席まわりを一周。運転席 ▸ 助手席の順で座り心地と操作系を確認。',
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
            '平坦路を直進し、ステアリングのスポークが水平（目安ずれ ±5° 以内）か確認。片流れやセンターずれは調整対象。加えて Service 画面でステアリング関連リコール/未実施キャンペーン表示がないか確認し、該当時は受領前に Due Bill へ記録。',
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
          title: '16 インチ中央スクリーン：傷・反応・コーティング',
          description:
            'Model Y L は 16 インチ中央タッチスクリーン (Juniper 以前の 15.4 インチから拡大)。画面の角・縁の傷、タッチ反応、コーティングの剥がれ。Apps ▸ Toybox ▸ Sketchpad で黒一面を 1 分表示すればドット欠け・バックライト漏れの検出に有効。',
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
      title: '4. 2 列目 (左キャプテン ▸ 右キャプテン)',
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
          title: '2 列目シート：ヒーター・ベンチレーション・電動リクライニング',
          description:
            '前席画面で Climate ▸ Rear を開き、Rear Climate を ON。左席温度→右席温度→風量の順に変更し、左右席へ独立反映されるか確認。ヒーター/ベンチレーション/電動リクライニングも左右別に作動確認。国内オーナーブログで操作迷い報告あり。',
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
          title: '8 インチ後席タッチスクリーン (標準装備)',
          description:
            '2 列目センターコンソール上の 8 インチタッチスクリーンが標準装備。ビデオ再生・音量・後席エアコン操作ができるか確認。',
          severity: 'minor',
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
            '大人 (身長 170 cm 前後) が短時間座れるか、頭部とリアガラスの距離は約 10〜15 cm (拳一つ強) になる設計のため段差走行時の頭部接触リスクに注意。シート固定の堅牢性も合わせて確認。',
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
            'Audio ▸ Settings ▸ Balance/Fade でフォーカスを四隅へ動かし、各スピーカーを単独確認。試聴は低音（例: Billie Eilish「bad guy」）と高音（例: 宇多田ヒカル「First Love」）の 2 曲を使うと音抜けや歪みを判別しやすい。',
          severity: 'minor',
        },
        {
          id: 'int.odor',
          title: '内装の異臭・タバコ臭・接着剤臭',
          description:
            '接着剤・新車カーペット・エアコン内部カビ由来の臭いを切り分けるため、全ドア開放で 10 分換気後に再確認。刺激臭が残る、または送風で酸っぱい臭いが出る場合はエアコン洗浄をその場で依頼。Reddit/TMC で納車初期報告が多く、必ず写真とメモを残す。',
          severity: 'major',
        },
        {
          id: 'int.dome-light',
          title: 'ドームライト：点灯・ドア連動',
          description:
            '前後席それぞれで点灯、タッチ操作、ドア開閉に連動して自然にオン／オフするか。',
          severity: 'minor',
        },
        {
          id: 'int.headliner-trim',
          title: 'ヘッドライナー：たるみ・クリップ浮き・縁トリム剥がれ (3 列分)',
          description:
            '天井ライナーを後席まで指でなぞり、たるみ・気泡・縁部のトリム剥がれ・クリップ浮きがないかを 3 列分確認。クリップが浮いていると走行振動で異音が出やすい。所要 3 分。',
          severity: 'major',
        },
        {
          id: 'int.trunk',
          title: 'ラゲッジ：トノカバー・12V/USB-C・サブトランク',
          description:
            '3 列目格納後の床段差に加え、サブトランク底面の湿り・水滴跡・カビ臭、排水穴まわりの詰まりを確認。TMC で納車直後の浸水報告多数。濡れを見つけたら拭き取り前に写真・動画を撮り、受領前に Due Bill へ必ず記載し、再発防止処置を依頼。',
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
          id: 'fn.12v-battery-health',
          title: '12V (補機) バッテリーの警告灯・電圧確認',
          description:
            'Controls ▸ Service ▸ Electrical を開き、12V (補機) バッテリー電圧が 12.6 V 以上あるか、オレンジ色の警告アイコンが点灯していないかを確認。12.3 V を下回る場合は要交換レベル。TMC では「納車直後にドアが内側から開かない」「タッチスクリーンが起動しない」「Sentry Mode で残量が急減」など 12V 由来のトラブルが報告されており、初期不良の温床として要注意。所要 1 分。',
          severity: 'critical',
        },
        {
          id: 'fn.hvac',
          title: 'HVAC：冷房・暖房・HEPA・除湿',
          description:
            '冷房/暖房の切替と除湿に加え、Bioweapon Defense Mode の表示・起動可否を確認。グローブボックス奥の HEPA/キャビンフィルターカバーを開け、フィルターが実装済みか目視。未装着や異臭は受領前に是正依頼し、写真付きで記録する。',
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
          id: 'fn.wireless-charging',
          title: 'ワイヤレス充電パッド (前席 × 2) の動作確認',
          description:
            '前席センターコンソールのワイヤレス充電パッド (前列 2 席分) にスマートフォンを置き、充電が開始するかを確認。充電中は充電アニメーションが表示される。所要 1 分。',
          severity: 'minor',
        },
        {
          id: 'fn.wipers',
          title: 'ワイパー：間欠・連続・ウォッシャー噴霧',
          description:
            '間欠/連続/自動の反応に加え、ウォッシャー液残量警告が出ていないか確認。寒冷地納車なら凍結防止タイプ（氷点下 -20 ℃ 目安）か担当へ確認し補充依頼。左右ノズルの噴射ずれや拭き残しは TMC/Reddit でも頻出で、動画を撮ってその場で申告し納車記録に残す。',
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
            '全 6 席でバックル着脱、警告表示、リトラクター巻取りを確認（急引きでロックするか）。2 列目左右の ISO-FIX 位置とトップテザー固定点を実見し、チャイルドシート適合を確認。不良は安全項目のため受領前に必ず是正依頼し、対応内容を記録。',
          severity: 'critical',
        },
        {
          id: 'fn.signals',
          title: 'ターンシグナル / ハザード',
          description:
            'Model Y L は左ストーク (タップで車線変更 3 回点滅、長押しで通常ウインカー) でウインカー操作。ハザードはステアリング上方ダッシュ中央の物理ボタン (赤三角)。両方を点灯確認。',
          severity: 'major',
        },
        {
          id: 'fn.horn',
          title: 'ホーン',
          description:
            '一度短く鳴らして音質に違和感がないか。',
          severity: 'major',
        },
        {
          id: 'fn.cameras',
          title: 'カメラ：全方位映像の歪み / 汚れ (HW4 / 9 カメラ)',
          description:
            'Model Y L は Hardware 4 (AI4) を搭載し、物理カメラは 9 個 (スクリーン上は 8 方位表示)。Controls ▸ Service ▸ Camera で全角度の映像を表示させ、ぼやけ・歪み・汚れがないかを確認。特に左右 B ピラーのリピーターカメラは内部結露 (condensation) が既知の欠陥で TMC / Reddit に多数報告あり。映像が曇って見える、または外からレンズを覗いて内部に水滴・霧が見える場合は保証修理対象なのでその場で指摘し、写真を Due Bill に添付すること。所要 3 分。',
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
            '車両カメラのキャリブレーションは通常 20〜100 km 必要。未完了中は Autopilot、Navigate on Autopilot、Autopark が制限/無効になる。Controls ▸ Autopilot の進捗バーを確認し、100 km 超で未完なら点検相談。',
          severity: 'minor',
        },
        {
          id: 'fn.voice-nav',
          title: 'ナビ／音声認識：目的地設定',
          description:
            '音声ボタンで「東京駅へ案内」「最寄りの Supercharger」「つくば市役所」を試し、候補表示から案内開始まで確認。Controls ▸ Display で日本語/英語切替後も認識できるか確認すると、初期設定漏れを見つけやすく、国内ブログでも有効とされる。',
          severity: 'minor',
        },
        {
          id: 'fn.sentry-dogmode',
          title: 'Sentry Mode / Dog Mode / Camp Mode',
          description:
            'すべて起動できるか、カメラ映像が正常に保存されるかを確認。地域・施設によっては Sentry Mode が自動無効化される場合があることも認識しておく。',
          severity: 'minor',
        },
        {
          id: 'int.cabin-air-filter',
          title: 'キャビンエアフィルター装着確認 (グローブボックス奥)',
          description:
            'グローブボックスを完全に開け、奥側のフィルターカバーを取り外してキャビンエアフィルターが装着されているかを確認。フィルター未装着での出荷事例がある。交換目安は走行 2 万 km ごと。所要 2 分。',
          severity: 'major',
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
          id: 'fn.steering-pull-alignment',
          title: '試走でハンドル放しによる左右流れ (アライメント) 確認',
          description:
            '時速 60〜80 km の直線で 3 秒間ハンドルから両手を放し、車体が真っすぐ走るかを確認。左右どちらかに流れる場合はアライメント不良の可能性がある。デリバリー前の輸送や保管でずれることがある。所要 2 分。',
          severity: 'major',
        },
        {
          id: 'fn.supercharger',
          title: 'スーパーチャージャー試し充電 (最大 250 kW)',
          description:
            '可能なら SOC 10〜30% で接続し、200 kW 以上まで立ち上がるか確認。目安は 50% 付近で約 150 kW、80% 付近で 50 kW 以下へ低下。接続後 60 秒以内に充電開始しない、出力が大きく外れる場合はその場で記録して申告。',
          severity: 'major',
        },
        {
          id: 'fn.charge-port-cable-button',
          title: '充電ポート蓋：充電ケーブル先端のボタンで自動オープン',
          description:
            'Supercharger ケーブルを車両に近づけ、コネクタ先端のボタンを押すと充電ポートの蓋が自動で開くか確認。蓋が開かないと現場で手動操作が必要になる。アプリ・タッチスクリーン・蓋タップなど別経路でも開閉できるか合わせて確認。',
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
          id: 'fn.sentry-usb',
          title: 'Sentry Mode 用 USB ドライブ装着・フォーマット確認',
          description:
            'グローブボックス左奥または前席センターコンソール下の USB ポートに Sentry Mode 用 USB ドライブ (FAT32 または exFAT フォーマット) が装着されているかを確認。Controls ▸ Safety ▸ Sentry Mode から「USB ドライブが見つかりました」の表示が出るかを確認。未装着の場合は別途準備が必要。所要 2 分。',
          severity: 'major',
        },
        {
          id: 'sw.fw-version',
          title: 'ソフトウェアバージョンを記録',
          description:
            '「サービス ▸ ソフトウェア」から控える。',
          severity: 'minor',
        },
        {
          id: 'sw.locale',
          title: '言語 / 地域 / 単位設定',
          description:
            '車載 UI の利用可能言語を確認し、距離 (km / mile)・時刻 (24h / 12h) などの基本設定が希望どおりかを確認。',
          severity: 'minor',
        },
        {
          id: 'sw.connectivity',
          title: 'Premium Connectivity / 標準コネクティビティ',
          description:
            'Premium Connectivity は通常 30 日試用で、終了後は自動課金されず手動加入。試用中は衛星マップ・車内動画ストリーミング・強化ライブトラフィックが利用可能。Standard で使える機能との差分（地図表示/音楽機能など）も納車時に確認しておく。',
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
          severity: 'major',
        },
      ],
    },
  ],
};
