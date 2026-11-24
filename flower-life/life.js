// 花的一生：故事資料（全部是「假字」初版，之後可以直接改字）
// ⚠️ 產地、天數都還沒查證，正式上線前要對過農業部資料。
// 文字口吻：安靜、看得仔細、對自然有敬意；看得到凋謝，但不悲情。

const LIFE_FLOWERS = [
  { name: "玫瑰", img: "img/rose.png", weight: 4,
    places: ["彰化田尾的溫室", "南投山腳下的溫室", "台中后里的花田"], color: "粉紅" },
  { name: "洋桔梗", img: "img/pinkflower.png", weight: 3,
    places: ["彰化的溫室", "雲林的網室"], color: "淡粉" },
  { name: "向日葵", img: "img/chamomile.png", weight: 3,
    places: ["台南的花田", "彰化的稻田邊"], color: "金黃" }
];

// 一生的階段（day＝第幾天開始；文字裡的 {花} {地} 會換成這一次的花和產地）
const LIFE_STAGES = [
  { day: 0, key: "seed", label: "種子",
    text: "你醒來的時候，四周是微溫的土。這裡是{地}。你還不知道自己會長成一朵{花}，只知道上面有光。" },
  { day: 6, key: "sprout", label: "發芽",
    text: "第一片子葉頂開了土。它很薄，薄到能看見光從背面透過來。你把它慢慢攤開，像第一次張開手。" },
  { day: 20, key: "leaf", label: "長葉",
    text: "葉子一片一片長出來。每一片都比上一片大一點，也記得一點昨天的雨。" },
  { day: 45, key: "bud", label: "花苞",
    text: "頂端鼓起一個小小的苞，裹得很緊。你把這幾十天收集的光，全都摺進裡面。" },
  { day: 60, key: "bloom", label: "開花",
    text: "某個清晨，苞輕輕裂開一道縫。你第一次看見自己的顏色，{色}的，比你想像的還要好看。" },
  { day: 68, key: "harvest", label: "採收",
    text: "剪刀很快，冰水很冷。你和同一排的花被捆在一起，躺進紙箱，在夜裡被載往城市。" },
  { day: 69, key: "market", label: "花市",
    text: "凌晨三點的花市燈很亮。拍賣的聲音一聲接一聲，有人把你拿起來，對著燈看了很久。" },
  { day: 70, key: "hands", label: "在某人手中",
    text: "" },     // 由「被誰買走」決定
  { day: 78, key: "fade", label: "慢慢謝了",
    text: "第八天，你的花瓣邊緣開始捲起來，顏色淡得像舊信紙。這是每一朵花都會走到的地方，你並不害怕。" },
  { day: 86, key: "soil", label: "回到土裡",
    text: "" }      // 由最後的選擇決定
];

// 路上的小事件（每次隨機挑幾個；effect：生命力 life、美 beauty、溫柔 warmth）
const LIFE_EVENTS = [
  { stage: "sprout", text: "一隻蝸牛從你旁邊慢慢經過，留下一道發亮的路。牠沒有吃你，只是路過。", effect: { warmth: 1 } },
  { stage: "sprout", text: "清晨的露水掛在你的子葉上，太陽一出來就不見了。你喝到了一點點。", effect: { life: 1 } },
  { stage: "sprout", text: "農人第一次蹲下來看你，看了很久，沒有說話，只是把旁邊的雜草拔掉。", effect: { warmth: 1 } },
  { stage: "leaf", text: "颱風夜，溫室的塑膠布被吹得啪啪響。你整夜抓緊了土，天亮時還站著。", effect: { life: 2 } },
  { stage: "leaf", text: "幾隻蚜蟲爬上你的嫩葉。後來來了一隻瓢蟲，事情就慢慢好了。", effect: { life: -1, warmth: 1 } },
  { stage: "leaf", text: "午後一場剛剛好的雨，不大，剛好把葉子上的灰洗乾淨。", effect: { beauty: 1 } },
  { stage: "bud", text: "一隻蜜蜂來得太早，在你的苞上繞了兩圈，又飛走了。牠會再回來的。", effect: { beauty: 1 } },
  { stage: "bud", text: "這幾天特別熱，農人在傍晚多澆了一次水，水聲很輕。", effect: { warmth: 1, life: 1 } }
];

// 三個選擇點
const LIFE_CHOICES = {
  cold: { stage: "leaf",
    text: "寒流來了。夜裡溫度降得很低，你能感覺到根附近的土變硬。",
    options: [
      { label: "把力氣留給根", text: "你把葉子收得很緊，把力氣往下送。長得慢一點，但根更深了。", effect: { life: 2 } },
      { label: "趁有陽光，多長一片葉", text: "白天的太陽還在，你多長了一片葉子。夜裡有點冷，但你撐過來了。", effect: { beauty: 2, life: -1 } }
    ] },
  buyer: { stage: "market",
    text: "兩個人同時看中了你。",
    options: [
      { label: "跟著一個背著書包的學生", to: "student" },
      { label: "跟著一位花店老闆", to: "shop" },
      { label: "跟著一個一直看手機、有點緊張的人", to: "confess" }
    ] },
  fade: { stage: "fade",
    text: "最後這幾天，你想用什麼樣子留下來？",
    options: [
      { label: "被倒掛起來，做成乾燥花", to: "dried" },
      { label: "被放回土裡", to: "soil" },
      { label: "被夾進一本書裡", to: "book" }
    ] }
};

// 被誰買走之後的日子
const LIFE_HANDS = {
  student: { who: "一個畢業生", text: "你被包進牛皮紙，和其他花一起，在畢業典禮上被高高舉起。她哭了，又笑了，照片裡有你。" },
  shop: { who: "一間新開的小店", text: "你被插在一間新店的門口。第一天，進門的每個人都看了你一眼，有人說：「好香。」" },
  confess: { who: "一個準備告白的人", text: "他把你藏在背後，手心都是汗。後來你被放在另一個人的書桌上，那個人每天早上都會看你一眼。" }
};

// 最後的樣子
const LIFE_ENDS = {
  dried: { title: "被留下來的顏色", text: "你被倒掛在窗邊，水分一點一點離開。顏色變淡了，形狀卻被留了下來。很久以後，還有人記得你。" },
  soil: { title: "回到土裡", text: "你被埋進陽台的花盆。花瓣先變成土，接著是莖。春天的時候，那盆土裡長出了別的東西。" },
  book: { title: "夾在書頁之間", text: "你被夾進一本很厚的書。書闔上的時候很暗，但很安靜。幾年後，有人翻到那一頁，停了很久。" }
};

// 結尾那一句（每次隨機一句）
const LIFE_CLOSING = [
  "你手上的每一朵花，都走過這麼長的路。",
  "下次收到花的時候，記得看它久一點。",
  "一朵花開不了多久，可是它很認真地開過。"
];
