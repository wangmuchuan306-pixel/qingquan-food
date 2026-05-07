export function getTab(selectedIndex) {
    const _this = getCurrentPages()[0]
    if (typeof _this.getTabBar === 'function' && _this.getTabBar()) {
        _this.getTabBar().setData({
            selected: selectedIndex
        })
        if (!_this.data.tabBarHeight) {
            _this.getTabBar().getHeight((height) => {
                if (height) {
                    _this.setData({
                        tabBarHeight: height + 'px'
                    })
                }
            })
        }
    }
}
export function changeTabBar(status) {
    const _this = getCurrentPages()[0]
    if (typeof _this.getTabBar === 'function' && _this.getTabBar()) {
        if(status == 1){
            _this.getTabBar().showTabBar()
        }else if(status == 0){
            _this.getTabBar().hideTabBar()
        }
    }
}
export default { getTab, changeTabBar }