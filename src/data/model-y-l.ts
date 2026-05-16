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
 * - 重要度 (critical/major/minor) を実用観点で全面再評価
 * - パネルギャップ・シール・フレーム整合など頻出トラブル項目を追加
 * - 各 description を「どこを・どう確認するか」が一目で分かるよう書き直し
 * - applicableTo フィールドで装備グレード差異を明示
 * - references フィールドに参考リンクを追加
 *
 * 注意: 仕様は変更される可能性があります。実車の納車時には最新の公式情報も
 * 併せて確認してください。
 */
export const modelYLTemplate: ChecklistTemplate = {
  modelId: 'model-y-l',
  modelName: 'Tesla Model Y L',
  modelNameJa: 'Tesla Model Y L (ロングホイールベース 6 人乗り)',
  version: '0.3.0',
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
      '後席エンタメスクリーン・2 列目ベンチレーションはグレードによって異なる',
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
          title: 'VIN が注文書・アプリと完全一致',
          description:
            'フロントガラス左下ダッシュボード上・運転席ドア開口部ステッカー・Tesla アプリ・購入契約書の 4 箇所すべてで VIN が一致することを目視確認。1 文字でも違えば受け取りを保留。',
          severity: 'critical',
          references: ['https://www.tesla.com/ownersmanual/modely/ja_jp/'],
        },
        {
          id: 'doc.registration',
          title: '車両登録証 / 一時抹消関連書類の確認',
          description:
            '日本では車検証・自動車検査証記録事項・自賠責保険証明書・リサイクル預託証明書の有無を確認。輸入車の場合は通関証明書や排ガス証明書も。',
          severity: 'critical',
        },
        {
          id: 'doc.warranty',
          title: '保証書 (新車・バッテリー) の確認',
          description:
            '電子保証の場合は Tesla アプリ → 「車両」→「保証」で確認。新車保証期間・バッテリー保証期間・距離制限を記録しておく。',
          severity: 'major',
          references: ['https://www.tesla.com/zh_CN/support/vehicle-warranty'],
        },
        {
          id: 'doc.mobile-connector',
          title: 'モバイルコネクター / アダプターの確認',
          description:
            '付属の充電ケーブルと各アダプター (家庭用 100V・200V・急速充電) の種類・数量を確認。コネクターの端子に変形・焦げがないか目視。',
          severity: 'major',
        },
        {
          id: 'doc.keycards',
          title: 'キーカード 2 枚の確認',
          description:
            'デフォルトで 2 枚同梱。その場で 1 枚ずつ B ピラーの NFC リーダーに当ててドア解錠を確認。紛失時の追加発行手順も確認しておく。',
          severity: 'major',
        },
        {
          id: 'doc.floormats',
          title: '同梱フロアマットの確認',
          description:
            '購入明細・パッケージリストに記載された列のフロアマットがすべて揃っているか確認。グレード・地域により 2 列分または 3 列分が異なる。',
          severity: 'minor',
        },
        {
          id: 'doc.manuals',
          title: '取扱説明書 (電子) へのアクセス確認',
          description:
            '車載スクリーン「アプリ」→「取扱説明書」を開いて表示できるか確認。Tesla アプリからも閲覧可能か確認。',
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
          title: 'パネルギャップが左右対称・規定内',
          description:
            'ボンネット・フロントドア・リアドア・フェンダー・リアハッチ・トランクの各ギャップを左右で比較。一般的に許容範囲は 3〜5 mm で左右差 1.5 mm 以内が目安。定規またはゲージカードを使うと正確。上下で隙間が均一か・段差 (フラッシュネス) も確認。',
          severity: 'major',
          references: [
            'https://www.reddit.com/r/TeslaModelY/comments/panel_gap_guide',
          ],
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
          id: 'ext.door-fit',
          title: 'ドアの建付け・開閉音 (4 枚)',
          description:
            '4 枚ドア全てを開閉し、閉まるときの「バシュッ」という密閉音を確認。Y L は後席ドアが標準 Y より長く重いため建付けズレが起きやすい。ヒンジの軋みや段差も確認。',
          severity: 'major',
        },
        {
          id: 'ext.paint',
          title: '塗装：傷・色ムラ・梨地・ピンホール・オレンジピール',
          description:
            '太陽光または LED 直下で全パネルを目視。スマホのフラッシュをオンにして接写すると輸送傷・梨地・ピンホール・塗りムラを発見しやすい。バンパー・ピラー・ドア下部は特に注意。白・シルバーは小傷が見づらいため角度を変えて確認。',
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
          id: 'ext.rear-hatch',
          title: 'リアハッチの開閉・段差・自動開閉',
          description:
            'パワーリフトゲートを全開→閉まで動作確認。閉まった状態のパネル段差とギャップが左右均等か確認。挟み込み防止 (障害物に当たったら止まるか) のテスト。開閉途中に異音がないか。',
          severity: 'major',
        },
        {
          id: 'ext.bumpers',
          title: 'バンパー (前後) の取付・浮き・均一な隙間',
          description:
            'バンパー全周をフェンダーやボンネット・リアゲートとのギャップを確認。Y L はリアバンパーが長く取付けミスが起きやすい。指で押して動かないか・クリップが飛んでいないか確認。',
          severity: 'major',
        },
        {
          id: 'ext.glass-roof',
          title: 'ガラスルーフ：傷・気泡・シール完全性',
          description:
            '内側・外側から傷・気泡・白濁を確認。Y L は後部座席まで延びる長尺ガラスのため面積が大きい。周囲のシールが全周均一に接着されているか、シールの欠け・浮きがないか確認。',
          severity: 'major',
        },
        {
          id: 'ext.windshield',
          title: 'フロント／リアガラス：チップ・線傷・コーティング',
          description:
            '輸送中のフライングストーンによるチップに注意。光を当てて角度を変えながら全面を確認。コーティングの剥がれや白濁がないか。',
          severity: 'major',
        },
        {
          id: 'ext.lights',
          title: 'ヘッドライト／テールライト：結露・点灯・左右均等',
          description:
            'ロー・ハイ・デイライト・ターン (前後) ・ブレーキ・リバース・リアフォグを一通り点灯。内部結露・レンズの傷を確認。左右のカットラインが同じ高さか確認。',
          severity: 'major',
        },
        {
          id: 'ext.charge-port',
          title: '充電ポート蓋の開閉・ラッチ動作',
          description:
            'Tesla アプリと車内ボタン両方で開閉確認。閉まりの戻りが遅い・ガタつく・隙間が均一でない場合は要確認。充電ポート内部の汚れ・異物も確認。',
          severity: 'major',
        },
        {
          id: 'ext.wheels',
          title: 'ホイール：縁石傷・センターキャップ・ロゴ向き',
          description:
            '4 本全周を目視。傷・凹み・削れがないか。センターキャップのロゴ向きが揃っているか確認。ホイールナット (または Aero カバー) の固定を確認。',
          severity: 'major',
        },
        {
          id: 'ext.tires',
          title: 'タイヤ：銘柄・サイズ・製造週・空気圧',
          description:
            '4 本が同銘柄・同サイズであることを確認。サイドウォールの DOT 製造週コードを確認 (製造から 2 年以内が理想)。空気圧を運転席ドア開口部のラベル記載値と比較。',
          severity: 'major',
        },
        {
          id: 'ext.door-handles',
          title: 'フラッシュドアハンドル：動作・戻り',
          description:
            '4 ドアのプッシュ式ハンドルを押し込み、ハンドルが出てきて引けること・離した後に正しく格納されることを確認。動作に左右差がないか。寒冷地では凍結リスクもあるため動作品質が重要。',
          severity: 'minor',
        },
        {
          id: 'ext.mirrors',
          title: 'サイドミラー：格納・調整・ヒーター',
          description:
            '電動格納を左右で確認。上下左右の調整を確認。ヒーターは冬季に重要なので「車両」設定から ON にして数十秒後に手で温度を確認。',
          severity: 'minor',
        },
        {
          id: 'ext.badges',
          title: 'エンブレム／バッジの位置・浮き・傾き',
          description:
            'リアの「Model Y」「L」バッジが水平で浮きがないか。フロントの T ロゴ・リアの T ロゴも確認。接着が弱い場合は早期に剥落する可能性がある。',
          severity: 'minor',
        },
        {
          id: 'ext.underside',
          title: '下回り・アンダーカバーの傷・緩み・脱落',
          description:
            'しゃがんで前後アンダーカバーを目視。傷・亀裂・クリップの脱落がないか。フラッシュをオンにして撮影すると確認しやすい。輸送中の低速接触で傷が入ることがある。',
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
          title: 'ステアリング：センター位置・ヒーター・スクロールホイール',
          description:
            '駐車状態で直進方向を向かせてステアリングがセンターか確認。スクロールホイールを上下に動かして反応を確認。ヒーターをオンにして数十秒後に温度上昇を確認。',
          severity: 'major',
        },
        {
          id: 'int.dashboard',
          title: 'ダッシュボードのトリム・軋み・浮き',
          description:
            '木目／アルミ調パネルの合わせ目に隙間・浮き・軋みがないか、指で押して確認。走行前の静止状態でチェックすること。',
          severity: 'minor',
        },
        {
          id: 'int.screen',
          title: '15.4 インチ中央スクリーン：傷・タッチ反応・コーティング',
          description:
            '画面を黒背景 (ダークモード) で表示してデッドピクセル・白点・輝度ムラを確認。縁・角の傷、タッチ反応のムラ、コーティングの剥がれを確認。ピンチ・スワイプ・マルチタッチが全面で正常か確認。',
          severity: 'major',
        },
        {
          id: 'int.ambient',
          title: 'アンビエントライト / ドア内張りライト',
          description:
            '「車両」→「ライト」→「アンビエントライト」で点灯。色・明るさの調整が追従するか確認。ドア内張りのLEDも均一に光るか確認。',
          severity: 'minor',
        },
        {
          id: 'int.frunk',
          title: 'フランク：電動開閉・ライナー固定・容量',
          description:
            'アプリまたはタッチスクリーンからフランクを開閉。内装ライナーが浮いていないか確認。フランク内に傷や汚れがないか確認。',
          severity: 'major',
        },
        {
          id: 'int.trunk',
          title: 'ラゲッジ：トノカバー・床の段差・サブトランク・フック',
          description:
            '3 列目を畳んだ状態でラゲッジ床の段差を確認。トノカバーのロールが正常か。サブトランクのカーペット固定・ラゲッジフック・ネットを確認。',
          severity: 'major',
        },
        {
          id: 'int.front-seats',
          title: '前席：電動調整・ヒーター・ベンチレーション',
          description:
            '前後スライド・背もたれ・高さ・ランバーサポートを全方向動作確認。シートヒーターを ON にして数分後に温度上昇を確認。ベンチレーション (装備時) のファン音と風量を確認。',
          severity: 'major',
        },
        {
          id: 'int.audio',
          title: 'オーディオ：全スピーカー音出し確認',
          description:
            '「エンターテインメント」→「サウンド」でバランス・フェーダーを端から端まで動かし、1 スピーカーずつ音が出るか確認。音割れ・こもり・片側のみ出ない症状をチェック。',
          severity: 'minor',
        },
        {
          id: 'int.odor',
          title: '内装の異臭・タバコ臭・接着剤臭',
          description:
            '車内に乗り込んで強い接着剤臭・塗料臭・タバコ臭がないか確認。工場出荷直後は多少の揮発臭があるが、刺激臭が強い場合は要確認。',
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
          title: '2 列目キャプテンシート × 2：スライド・リクライニング',
          description:
            '各シートのスライドレールを前後端まで動かし引っ掛かりがないか確認。リクライニングレバーの動作と各段階での固定を確認。左右シートで動作差がないか確認。',
          severity: 'major',
        },
        {
          id: 'yl.row2-power',
          title: '2 列目シート：電動調整・ヒーター・ベンチレーション',
          description:
            '電動調整装備グレードの場合: 前倒し・スライド・リクライニングの電動動作をスムーズに確認。ヒーター・ベンチレーションは装備グレードにより有無が異なる。契約書で確認してから検査すること。',
          severity: 'major',
          applicableTo: ['RWD Long Range', 'Dual Motor Performance'],
        },
        {
          id: 'yl.walkthrough',
          title: '2 列目間のウォークスルー通路',
          description:
            '2 シート間の通路に大人が支障なく通れる幅があるか確認。トリムの干渉・床マットのはみ出し・シートの傾きなどがないか確認。',
          severity: 'minor',
        },
        {
          id: 'yl.row3-access',
          title: '3 列目へのアクセス機構 (2 列目前倒しレバー)',
          description:
            '2 列目の前倒しレバー／ボタンを操作し、3 列目へのアクセス通路が開くことを確認。復帰動作がスムーズか、シートが元の位置・角度に戻るか確認。',
          severity: 'major',
        },
        {
          id: 'yl.row3-seats',
          title: '3 列目シート：背もたれ・ヘッドルーム・固定',
          description:
            '実際に座って背もたれ角度・ヘッドルーム・シート幅を確認。シートが正しく固定されていることを揺すって確認。畳む・展開する動作を両側で確認。',
          severity: 'major',
        },
        {
          id: 'yl.row3-belts',
          title: '3 列目シートベルト × 2 の動作',
          description:
            'バックルへの挿入・解除を両サイドで確認。テンショナーがスムーズに引き出せる・戻ることを確認。バックルのロック感・クリック音を確認。安全上最重要な確認事項。',
          severity: 'critical',
        },
        {
          id: 'yl.usb',
          title: '各列の USB-C ポート：通電・充電速度',
          description:
            'スマホを接続して前席・2 列目・3 列目すべての USB-C で充電表示が出るか確認。給電のみか Data も通るかは設定で確認。',
          severity: 'minor',
        },
        {
          id: 'yl.rear-hvac',
          title: '後席 HVAC 吹き出し口・後席タッチパネル',
          description:
            '後席の HVAC 吹き出し口から実際に風が出るか・温度調整が反映されるか確認。後席タッチパネル (装備グレード) の反応・表示内容を確認。グレードにより未装備の場合あり。',
          severity: 'major',
          applicableTo: ['Long Range', 'Performance'],
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
          id: 'yl.cargo-with-3rd',
          title: '3 列目使用時のラゲッジ容量・床段差',
          description:
            '3 列目を立てた状態でラゲッジスペースの広さと床の段差を確認。フックやネットの位置と固定を確認。',
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
          title: '警告灯・メッセージが出ていないことの確認',
          description:
            '走行準備状態でスクリーン上部の警告バナーや車両イラスト上の赤色・黄色アイコンがゼロであることを確認。補機バッテリー警告・タイヤ空気圧警告・サービス推奨メッセージも確認。',
          severity: 'critical',
        },
        {
          id: 'fn.wipers',
          title: 'ワイパー：間欠・連続・オートウェット・ウォッシャー',
          description:
            'ウォッシャー液を噴射してワイパーが自動起動するか確認 (Auto モード)。間欠・連続の各速度を設定から変更して確認。左右ノズルの噴射位置が正常か確認。',
          severity: 'major',
        },
        {
          id: 'fn.windows',
          title: '全ウィンドウ：オート開閉・挟み込み防止',
          description:
            '4 枚すべてオート開閉 (スイッチを軽くタップで自動全開・全閉) を確認。紙を挟んで挟み込み防止センサーが機能するか確認。閉まりきった状態で雨水が入らない密閉を確認。',
          severity: 'major',
        },
        {
          id: 'fn.headlights',
          title: 'ヘッドライト：ロー/ハイ/オートハイビーム',
          description:
            '夜間または暗所で各モードを切替確認。デイタイムランニングライトの点灯も確認。オートハイビームの動作はナビ操作時の LED カーテシランプ確認でも代替可。',
          severity: 'major',
        },
        {
          id: 'fn.signals',
          title: 'ターンシグナル・ハザード',
          description:
            '左右ウインカーを前後で目視確認 (助手席に頼む or 鏡を使う)。ハザードボタンを押して全灯点滅を確認。ステアリングコラムのウインカーレバーの操作感を確認。',
          severity: 'major',
        },
        {
          id: 'fn.horn',
          title: 'ホーン',
          description:
            '一度短く鳴らして音質に違和感 (音割れ・かすれ・左右の音量差) がないか確認。',
          severity: 'minor',
        },
        {
          id: 'fn.hvac',
          title: 'HVAC：冷房・暖房・HEPA・除湿',
          description:
            '冷房: AC を最低温度にして数十秒後に吹き出し口が冷えることを確認。暖房: 最高温度にして床・前面から暖風が出ることを確認。Bioweapon Defense Mode (装備時) の起動も確認。',
          severity: 'major',
        },
        {
          id: 'fn.heated-steering',
          title: 'ステアリングヒーター',
          description:
            '「車両」→「ドライバー補助」→「ステアリングホイールヒーター」をオンにして 30 秒後にステアリングが温まることを触れて確認。',
          severity: 'minor',
        },
        {
          id: 'fn.cameras',
          title: 'カメラ：全方位映像の歪み・汚れ・欠け',
          description:
            '「カメラ」ビューですべての方位 (前・左・右・後・バードビュー) の映像を確認。汚れ・内部結露・映像欠け (黒帯・ぼやけ) がないか確認。',
          severity: 'major',
        },
        {
          id: 'fn.sensors',
          title: 'パーキングセンサー (Tesla Vision) ／ Autopark',
          description:
            '駐車場で低速走行し、前後・左右の距離表示がスクリーンに表示されることを確認。可能ならAutopark で 1 マス分のテスト。',
          severity: 'major',
        },
        {
          id: 'fn.autopilot-cal',
          title: 'Autopilot キャリブレーション進行',
          description:
            '納車直後はキャリブレーション未完了が正常。安全な高速道路で数 km 走行すると完了する。納車時点ではステータスを記録しておくだけでよい。',
          severity: 'minor',
        },
        {
          id: 'fn.supercharger',
          title: 'スーパーチャージャー試し充電',
          description:
            '近くのスーパーチャージャーに立ち寄り、充電が開始・電流が流れることを確認。スクリーンに充電カーブと推定完了時刻が表示されるか確認。',
          severity: 'major',
        },
        {
          id: 'fn.sentry-dogmode',
          title: 'Sentry Mode / Dog Mode / Camp Mode',
          description:
            '「安全」→「Sentry モード」をオンにしてアプリからカメラ映像が届くか確認。Dog Mode は夏季の実用上重要。',
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
          description:
            'Tesla アプリ→「車両」でこの VIN が「オーナー」権限で表示されていることを確認。「ドライバー」表示の場合は権限移転が完了していない可能性がある。',
          severity: 'critical',
        },
        {
          id: 'sw.phone-key',
          title: 'スマホキー登録・動作確認',
          description:
            'Tesla アプリで Bluetooth 経由のスマホキーが有効になっているか確認。車に近づいてドアがアンロックされることを確認。家族分の追加方法も把握しておく。',
          severity: 'major',
        },
        {
          id: 'sw.fw-version',
          title: 'ソフトウェアバージョンを記録',
          description:
            '「サービス」→「ソフトウェア」でバージョンと更新履歴を確認・写真撮影。後のサービス記録に使用。',
          severity: 'minor',
        },
        {
          id: 'sw.connectivity',
          title: 'Premium Connectivity / 標準コネクティビティ確認',
          description:
            '契約した接続プランが有効か「Tesla アカウント」→「サブスクリプション」で確認。ストリーミング・衛星マップが使えるか実際に試す。',
          severity: 'minor',
        },
        {
          id: 'sw.locale',
          title: '言語 / 地域 / 単位設定の確認',
          description:
            '「車両」→「ディスプレイ」で言語 (日本語)・距離単位 (km)・時刻形式 (24h) を確認。設定が引き継がれていない場合は再設定。',
          severity: 'minor',
        },
        {
          id: 'sw.fsd-eap',
          title: 'FSD / Autopilot オプションの有効化状況',
          description:
            '購入したオプション (FSD / 拡張オートパイロット等) がスクリーン「Autopilot」設定に反映されているか確認。反映されていない場合は納車担当者に当日確認を求めること。',
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
          description:
            '納車時点で気づいた問題・疑問点を Tesla の担当者にその場で伝え、「Due Bill」として書面または Tesla サービスアプリ上のタスクとして記録。口頭だけで終わらせないこと。',
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
            'Tesla アプリ →「サービス」→「新しいサービスリクエスト」の手順を確認。問題項目は当日中にリクエストを送信することを推奨。モバイルサービスの対応可否も確認。',
          severity: 'major',
        },
        {
          id: 'af.return-policy',
          title: 'リターンポリシー (国・地域による)',
          description:
            '日本では一般的にキャンセル・返品制度は適用外。最新の Tesla Japan の規約を確認。問題があった場合の Due Bill での対応が現実的な救済策。',
          severity: 'minor',
        },
      ],
    },
  ],
};
