//1.パスワードを自動で生成するスクリプト
const bf = require('bruteforce');

const creatPassWord = () => {
  bf({
    len: 10,
    chars: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '1','2','3','4','5','6','7','8','9','0'],
    step: console.log
  });
};

//2.成功するまでひたすらパスワードを入力し、ログインを試し続ける自動スクリプト
const URL = 'file:///Users/horiguchi_seito/Documents/develop/hack-test/index.html';
const webdriver = require('selenium-webdriver');
const { Builder, By, until } = webdriver;
const capabilities = webdriver.Capabilities.chrome();
capabilities.set('chromeOptions', {
    args: [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        `--window-size=1980,1200`
        // other chrome options
    ]
});
const autoLogin = (id, pw) => {
  const driver = new Builder().withCapabilities(capabilities).build();

  driver.get(URL)
  .then(() => {
    const $id = driver.findElement(By.id('loginInner_u'));
    const $pw = driver.findElement(By.id('loginInner_p'));
    const $trigger = driver.findElement(By.id('js-trigger'));
    
    // const limit = 10;
    // let index = 0;
    // while(index < limit){
      let index = 0;
      const DummyLen = 3;
      const tryLogin = (callback) => {
        $id.sendKeys('test');
        $pw.sendKeys('test');
        $trigger.click()
        .then(async () => {

          const currentUrl = await driver.getCurrentUrl();
          if(index > DummyLen){
          // if(currentUrl === URL){
            //Success
            console.log('Success!');
          } else {
            index++;
            // failed
            tryLogin(callback);
          }
        })
        .catch((err) => {
          console.log(err);
          driver.quit();
        });
      }
      tryLogin(tryLogin);
      // 
      
    //   index++;
    // }
  })
  .catch((err) => {
    console.log(err);
    driver.quit();
  });

  

  // sleep(3);

  // driver.quit();
};
autoLogin();

// const clickHandle = () => {

// };
// const $trigger = $doc.getElementById('js-trigger');
// $trigger.addEventListener('click', () => { clickHandle(); });