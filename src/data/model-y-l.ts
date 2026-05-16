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
            '車検証 (2023 年以降は電子車検証 IC カード) と自賠責保険証明書を物理的に車内 (グローブボックス) に常時携帯することが法律で義務 (道路運送車両法第 66 条)。デジタルのみの納車は不可。VIN・所有者氏名・住所が注文書と一致するか確認。',
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
            '輸送中のフライングストーンによるチップに注意。Juniper 以降は全窓に二層遮音ガラス (acoustic) を採用。工場ダッシュカムは無く、Sentry Mode が車載 8 カメラで録画を担当する。',
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
            '4 本のホイール全周を確認。縁石傷の有無、センターキャップとロゴの向き (Tesla T マークが 12 時位置で揃っているか) を確認。',
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
            'ドア開口部の対角線 (左上⇄右下、右上⇄左下) をメジャーで計測し、差が 5 mm 以内か確認。大きなずれはフレーム歪みの可能性あり最重要欠陥。Tesla 納車プロセスにはこの確認は含まれないため、オーナー自身か第三者の验车师 (検車サービス) が実施する。',
          severity: 'critical',
        },
        {
          id: 'ext.paint',
          title: '左右サイドの塗装：傷・色ムラ・ピンホール',
          description:
            '太陽光または LED 直下で全パネルを 45° 角度で目視。orange peel (梨地) は爪で引っかかるレベルなら service eligible。Pearl White は汚れや擦り傷が目立ちやすく、Cosmic Silver や暗色は orange peel そのものが目立ちやすい。',
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
            '直進時にセンターからずれていないか。スクロールホイール・ヒーターの動作も確認。ホーン・ウインカー等の機能テストは step-7 で実施。',
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
            '2 列目はキャプテンシート 2 脚で、ヒーター・ベンチレーション・電動リクライニング・電動アームレストを装備。前後スライドは手動の可能性が高い。各機能が独立に動作するかを左右両席で確認。',
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
            'バランス／フェーダーをまわして 1 スピーカーずつ音が出るか。',
          severity: 'minor',
        },
        {
          id: 'int.odor',
          title: '内装の異臭・タバコ臭・接着剤臭',
          description:
            '車内に乗り込んで強い接着剤臭・塗料臭・タバコ臭がないか確認。工場出荷直後は多少の揮発臭があるが、刺激臭が強い場合は要確認。',
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
          id: 'fn.12v-battery-health',
          title: '12V (補機) バッテリーの警告灯・電圧確認',
          description:
            'Controls ▸ Service ▸ Electrical を開き、12V (補機) バッテリー電圧が 12.6 V 以上あるか、オレンジ色の警告アイコンがないかを確認。低電圧警告はランダムな異常挙動の原因になるため要確認。所要 1 分。',
          severity: 'critical',
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
            '全 6 席（前列・2 列目・3 列目）のベルト着脱・警告・テンショナーを確認。バックル挿入・解除、巻取り、着座検知と警告表示／警告音も合わせて確認。',
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
            'Model Y L は Hardware 4 (AI4) を搭載し物理カメラは 9 個 (スクリーン上は 8 方位表示)。Camera ビューで全角度の鮮明度を確認。B ピラーのリピーターカメラ内部結露は既知欠陥なので特に注意。',
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
            '車両カメラのキャリブレーションには通常 20〜100 km の走行が必要。Controls ▸ Autopilot に進捗バーが表示される。納車時点では未完で構わない。',
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
            'Model Y L のピーク充電は 250 kW (Tesla V3 Supercharger 規格上限と一致)。V4 (500 kW キャビネット) は 2025 年から段階展開中。コネクタを接続してから 60 秒以内に充電開始するか、充電カーブが想定値か、車載画面の表示が正常かを確認。',
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
          severity: 'major',
        },
      ],
    },
  ],
};
