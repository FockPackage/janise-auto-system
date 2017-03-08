import mobiscroll from 'mobiscroll'

const mobInfo = {
  lang: localStorage.getItem("language") || 'zh',
  display: 'bottom', //默认 bottom 其他有 top,modal 等
  mode: 'Scroller', // 默认是Scroller ,其他有Mixed
  theme: 'ios', //默认"android-holo mobiscroll"
};


// 只会处理一下几种输入验证类型
const willHandleInputTypes = ['date', 'time', 'timeRange', 'dateRange','color'];

const mScroll = {
  /**
   * 用mobile库把input控件初始化为日期选择控件
   * @param {Element} input
   * @param {object} config
   */
  'date': (input, config) => {
    const currYear = (new Date()).getFullYear();
    mobiscroll.date(input, {
      preset: 'date', //日期，可选：date\datetime\time\tree_list\image_text\select
      theme: mobInfo.theme, //皮肤样式，可选：default\android\android-ics light\android-ics\ios\jqm\sense-ui\wp light\wp
      display: mobInfo.display, //显示方式 ，可选：modal\inline\bubble\top\bottom
      mode: mobInfo.mode, //日期选择模式，可选：scroller\clickpick\mixed
      lang: mobInfo.lang,
      dateFormat: 'yyyy-mm-dd', // 日期格式
      dateOrder: 'yyyymmdd', //面板中日期排列格式
      showNow: true,
      startYear: currYear - 200, //开始年份
      endYear: currYear + 100, //结束年份
      ...config,
    });
  },


  /**
   * 用mobile库把input控件初始化为日期范围选择控件
   * @param {Element} input
   * @param {object} config
   */
  "dateRange": (input, config) => {
    mobiscroll.range(input, {
      theme: mobInfo.theme,
      lang: mobInfo.lang,
      display: mobInfo.display,
      ...config,
    });
  },

  /**
   * 用mobile库把input控件初始化为时间选择控件
   * @param {Element} input
   * @param {object} config
   */
  "time": (input, config) => {
    mobiscroll.time(input, {
      theme: mobInfo.theme,
      lang: mobInfo.lang,
      display: mobInfo.display,
      timeFormat: 'HH:ii',
      timeWheels: 'HHii',
      headerText: false,
      ...config,
    });
  },


  /**
   * 用mobile库把input控件初始化为时间范围选择控件
   * @param {Element} input
   * @param {object} config
   */
  "timeRange": (input, config) => {
    mobiscroll.range(input, {
      theme: mobInfo.theme,
      lang: mobInfo.lang,
      display: mobInfo.display,
      controls: ['time'],
      maxWidth: 100,
      ...config,
    });
  },

  "color": (input, config) => {
    mobiscroll.color(input, {
      theme: mobInfo.theme,
      lang: mobInfo.lang,
      display: mobInfo.display,
      ...config,
    });
  },
};

function mobiInit(input, config) {
  const {type} = config;
  if (willHandleInputTypes.indexOf(type) < 0){
    return;
  }
  mScroll[config.type](input, config);
}

/**
 * 用mobile库把input控件初始化选择树
 * @param {object} list
 * @param {number} grades
 * @param {object} config
 */
export function mobiInitTreeList(list, config = {}){
  mobiscroll.treelist(list, 'clear');
  config = {
    theme: mobInfo.theme,
    display: mobInfo.display,
    lang: mobInfo.lang,
    circular: [false, false, false],
    ...config
  };
  mobiscroll.treelist(list, config);
}


export default mobiInit;
