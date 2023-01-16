import React, { useState } from 'react';
import intl from '../../../intl';
import { Button } from '@alicloud/console-components';
import styles from './index.module.less';
// @ts-ignore
import { AesSurvey, createAesInstance } from '@ali/aem-plugin';
import '@ali/aem-plugin/build/style.css';

const Helper = () => {
  createAesInstance({
    local: 'zh-cn',
    uid: (window as any)?.ALIYUN_OSS_CONSOLE_CONFIG?.USER_ID || 'anonymous',
  });

  const [score, setScore] = useState(0);
  const [type, setType] = useState('');

  return (
    <div className={styles.help}>
      <div className={styles.helpPrefix}>
        <div>{intl('oss.diagnose.is.help.tip')}</div>
        <div className={styles.helpButton}>
          <AesSurvey
            {...{
              questionnaireId: 2375,
              hiddenConfig: [{ id: 'a0859c', score }],
              onVisibleChange: () => {
                setScore(0);
                setType('');
              },
              trigger: (
                <div>
                  <Button
                    size="small"
                    style={{
                      background: 'transparent',
                      display: 'flex',
                      border: '0px',
                      color: '#696969',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      textAlign: 'center',
                      alignItems: 'center',
                    }}
                    onClick={() => {
                      setScore(5);
                      setType('up');
                    }}
                  >
                    {type === 'up' ? (
                      <img
                        src="https://img.alicdn.com/imgextra/i3/O1CN01ZNzbTD25erthxjCCu_!!6000000007552-55-tps-14-14.svg"
                        alt="up"
                      />
                    ) : (
                      <img
                        src="https://img.alicdn.com/imgextra/i1/O1CN01W8U7Bg1yE7S0MYzTp_!!6000000006546-55-tps-16-16.svg"
                        alt="up"
                      />
                    )}
                    <span style={{ color: type === 'up' ? '#0064C8' : '', marginLeft: '4px' }}>
                      {intl('common.tool.helpful')}
                    </span>
                  </Button>
                </div>
              ),
            }}
          />
          <AesSurvey
            {...{
              questionnaireId: 2375,
              hiddenConfig: [{ id: 'a0859c', score }],
              onVisibleChange: () => {
                setScore(0);
                setType('');
              },
              trigger: (
                <div>
                  <Button
                    size="small"
                    style={{
                      background: 'transparent',
                      display: 'flex',
                      border: '0px',
                      color: '#696969',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      textAlign: 'center',
                      alignItems: 'center',
                    }}
                    onClick={() => {
                      setScore(1);
                      setType('down');
                    }}
                  >
                    {type === 'down' ? (
                      <img
                        style={{ marginLeft: '4px' }}
                        src="https://img.alicdn.com/imgextra/i2/O1CN01scr9xJ25utl6AI6it_!!6000000007587-55-tps-14-14.svg"
                        alt=""
                      />
                    ) : (
                      <img
                        style={{ marginLeft: '4px' }}
                        src="https://img.alicdn.com/imgextra/i2/O1CN01O662P51aeBD6nG2Wt_!!6000000003354-55-tps-16-16.svg"
                        alt="https://img.alicdn.com/imgextra/i2/O1CN01O662P51aeBD6nG2Wt_!!6000000003354-55-tps-16-16.svg"
                      />
                    )}
                    <span style={{ color: type === 'down' ? '#0064C8' : '', marginLeft: '4px' }}>
                      {intl('common.tool.notHelpful')}
                    </span>
                  </Button>
                </div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Helper;
