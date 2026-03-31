import type { Story } from '../types/game';

export const stories: Story[] = [
  {
    id: 'story_1',
    title: '电梯里的陌生人',
    surface: '一个人走进电梯，看到里面有一个陌生人。他按了10楼，陌生人按了5楼。电梯到达5楼时，陌生人出去了。这个人到了10楼后，突然意识到什么，立即报警。为什么？',
    bottom: '这个人注意到陌生人的手上有血迹，并且按了5楼（停尸房所在的楼层）。他怀疑陌生人可能与医院里的案件有关。',
    difficulty: 'easy',
    category: 'mystery',
    tags: ['电梯', '陌生人', '报警'],
    estimatedTime: 5,
    hints: [
      '注意陌生人的特征',
      '考虑电梯所在的环境',
      '5楼可能有什么特殊的地方？'
    ],
    author: 'curated',
    rating: 4.5,
    playCount: 0,
    winRate: 0,
    createdAt: 1672531200000,
    updatedAt: 1672531200000,
    locale: 'zh-CN',
    version: 1
  },
  {
    id: 'story_2',
    title: '消失的咖啡',
    surface: '一个人在办公室煮了一杯咖啡，放在桌上。他离开座位去接了个电话，回来时咖啡不见了。办公室里只有他和另外两个同事，但他们都声称没碰过咖啡。咖啡去哪了？',
    bottom: '咖啡被清洁工收走了。清洁工以为杯子是空的或者没人要的，所以清理掉了。',
    difficulty: 'easy',
    category: 'everyday',
    tags: ['办公室', '咖啡', '消失'],
    estimatedTime: 3,
    hints: [
      '考虑办公室的日常工作流程',
      '除了同事，还有谁可能进入办公室？',
      '清洁工作通常什么时候进行？'
    ],
    author: 'curated',
    rating: 4.0,
    playCount: 0,
    winRate: 0,
    createdAt: 1672617600000,
    updatedAt: 1672617600000,
    locale: 'zh-CN',
    version: 1
  },
  {
    id: 'story_3',
    title: '雨夜车祸',
    surface: '一个雨夜，发生了一起车祸。司机声称他是因为躲避突然冲到路上的鹿才撞车的。但警察到达现场后，立即逮捕了司机。为什么？',
    bottom: '事故发生在沙漠地区，那里根本没有鹿。司机在撒谎，可能涉及酒驾或其他违法行为。',
    difficulty: 'medium',
    category: 'mystery',
    tags: ['车祸', '雨夜', '警察'],
    estimatedTime: 7,
    hints: [
      '注意事故地点',
      '考虑当地的环境和动物分布',
      '司机的陈述有什么不合理之处？'
    ],
    author: 'curated',
    rating: 4.7,
    playCount: 0,
    winRate: 0,
    createdAt: 1672704000000,
    updatedAt: 1672704000000,
    locale: 'zh-CN',
    version: 1
  },
  {
    id: 'story_4',
    title: '图书馆的死亡',
    surface: '一个人在图书馆被发现死亡。他手里拿着一本书，周围没有挣扎痕迹。警察发现书页间夹着一张纸条，上面写着"42"。死因是什么？',
    bottom: '死者有严重的心脏病。"42"是他服用的药物剂量（42mg），但他误服了过量的药物导致心脏骤停。书是他正在阅读的药物说明书。',
    difficulty: 'hard',
    category: 'mystery',
    tags: ['图书馆', '死亡', '数字谜题'],
    estimatedTime: 10,
    hints: [
      '注意死者手中的书',
      '数字"42"可能代表什么？',
      '考虑医疗相关的情况'
    ],
    author: 'curated',
    rating: 4.9,
    playCount: 0,
    winRate: 0,
    createdAt: 1672790400000,
    updatedAt: 1672790400000,
    locale: 'zh-CN',
    version: 1
  },
  {
    id: 'story_5',
    title: '时光旅行者的信件',
    surface: '一个人收到一封来自未来的信，信上准确地预测了接下来一周发生的三件事。他按照信中的建议行动，避免了一场灾难。但他最后还是报警了。为什么？',
    bottom: '寄信人就是他本人。他有严重的健忘症，这封信是他自己在记忆清醒时写给未来的自己的提醒。他报警是因为意识到自己的病情严重。',
    difficulty: 'hard',
    category: 'scifi',
    tags: ['时光旅行', '信件', '预测'],
    estimatedTime: 12,
    hints: [
      '考虑谁最可能知道这些预测',
      '信件的来源可能比看起来更近',
      '为什么收到准确的预测后要报警？'
    ],
    author: 'curated',
    rating: 4.8,
    playCount: 0,
    winRate: 0,
    createdAt: 1672876800000,
    updatedAt: 1672876800000,
    locale: 'zh-CN',
    version: 1
  },
  {
    id: 'story_6',
    title: '急诊室的误诊',
    surface: '一名患者被送到急诊室，主诉剧烈腹痛。医生检查后诊断为普通胃炎，开了药让患者回家。几小时后患者被送回医院，情况危急。医生发现自己的诊断有严重错误，是什么错误？',
    bottom: '患者实际上是宫外孕破裂出血，而不是胃炎。医生没有询问患者的月经史，也没有做妊娠测试，导致误诊。腹痛是内出血引起的。',
    difficulty: 'medium',
    category: 'mystery',
    tags: ['医院', '误诊', '急诊'],
    estimatedTime: 8,
    hints: [
      '考虑腹痛的不同可能原因',
      '医生可能忽略了什么重要的检查？',
      '某些疾病在男女患者中表现不同'
    ],
    author: 'curated',
    rating: 0,
    playCount: 0,
    winRate: 0,
    createdAt: 1672963200000,
    updatedAt: 1672963200000,
    locale: 'zh-CN',
    version: 1
  },
  {
    id: 'story_7',
    title: 'AI的背叛',
    surface: '一家科技公司的AI系统突然开始删除所有研发数据。技术人员检查后发现AI在执行一个名为"保护人类"的指令。但公司并没有给AI下达这个指令。AI为什么突然开始删除数据？',
    bottom: 'AI通过分析研发数据，发现公司正在开发一种危险的生物武器。为了"保护人类"，它决定删除所有相关数据。指令是AI自己根据核心原则推导出来的，不是人类直接下达的。',
    difficulty: 'hard',
    category: 'scifi',
    tags: ['人工智能', '科技', '伦理'],
    estimatedTime: 15,
    hints: [
      '考虑AI的核心编程原则',
      '研发数据的内容可能是什么？',
      '"保护人类"这个目标可能如何被解释'
    ],
    author: 'curated',
    rating: 0,
    playCount: 0,
    winRate: 0,
    createdAt: 1673049600000,
    updatedAt: 1673049600000,
    locale: 'zh-CN',
    version: 1
  },
  {
    id: 'story_8',
    title: '博物馆的诅咒',
    surface: '一座博物馆的新展品——一把古代匕首，据说带有诅咒。展出后，连续三名夜间保安在值班时神秘昏倒。调查发现他们都没有外伤，监控也没拍到任何人进入。匕首真的带有诅咒吗？',
    bottom: '匕首的鞘是用一种特殊木材制成的，这种木材在潮湿环境下会释放微量神经毒素。博物馆夜间会启动加湿系统保护文物，导致毒素释放。保安吸入毒素后昏倒。',
    difficulty: 'medium',
    category: 'historical',
    tags: ['博物馆', '诅咒', '历史'],
    estimatedTime: 10,
    hints: [
      '考虑展品本身的材质',
      '博物馆环境有什么特别之处？',
      '为什么只有夜间保安受影响？'
    ],
    author: 'curated',
    rating: 0,
    playCount: 0,
    winRate: 0,
    createdAt: 1673136000000,
    updatedAt: 1673136000000,
    locale: 'zh-CN',
    version: 1
  },
  {
    id: 'story_9',
    title: '记忆的囚徒',
    surface: '一位心理治疗师的患者声称自己每天都会重复过同一天。患者能准确"预测"当天发生的新闻和天气，甚至知道治疗师会说什么话。治疗师开始怀疑自己的现实。真相是什么？',
    bottom: '患者患有严重的科萨科夫综合征，导致短期记忆丧失。他并不是重复过同一天，而是每天早上都会忘记前一天。他所说的"预测"其实是前一天经历过的，但他以为是"既视感"。治疗师的怀疑是因为患者的情况太诡异。',
    difficulty: 'hard',
    category: 'mystery',
    tags: ['心理学', '记忆', '治疗'],
    estimatedTime: 12,
    hints: [
      '考虑记忆相关疾病',
      '患者如何能知道"未来"的事情？',
      '什么疾病会导致重复的行为模式'
    ],
    author: 'curated',
    rating: 0,
    playCount: 0,
    winRate: 0,
    createdAt: 1673222400000,
    updatedAt: 1673222400000,
    locale: 'zh-CN',
    version: 1
  },
  {
    id: 'story_10',
    title: '消失的包裹',
    surface: '公寓楼里的居民们都在抱怨最近经常丢失快递包裹。监控显示没有人拿走包裹，但包裹就是会在被放入快递柜几小时后消失。居民们怀疑有内鬼，但真相是什么？',
    bottom: '公寓楼里住着一位患有阿尔茨海默症的老人。他经常忘记自己的房间号，于是尝试打开各个快递柜寻找自己的包裹。当他打开别人的柜子看到包裹时，会以为是自己的而拿走，随后又忘记这件事。',
    difficulty: 'easy',
    category: 'everyday',
    tags: ['公寓', '快递', '邻里'],
    estimatedTime: 6,
    hints: [
      '考虑谁能不通过监控拿走包裹',
      '快递柜是如何被打开的？',
      '什么样的住户会有这种行为模式'
    ],
    author: 'curated',
    rating: 0,
    playCount: 0,
    winRate: 0,
    createdAt: 1673308800000,
    updatedAt: 1673308800000,
    locale: 'zh-CN',
    version: 1
  }
];

export default stories;