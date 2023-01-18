import React, { useState, useEffect } from 'react';
import { Form, Input, NumberPicker, Icon, Dialog } from '@alicloud/console-components';
import Split from './components/Split';
import {
  buildUrl,
  computeSignature,
  formatForm,
  formItemLayout,
  saveToStorage,
  getFromStorage,
} from './utils';
import { FormValue, HistoryLog, PageIndex } from './types';
import intl from '../intl';
import SignatureHistory from './components/SignatureHistory';
import QueryParams from './components/QueryParams';
import styles from './index.module.less';
import moment from 'moment';
import { ResourceDataType } from '../rc/components/Resource';
import { sortBy } from 'lodash';

const FormItem = Form.Item;

export default (props: PageIndex) => {
  const [expireTime, setExpireTime] = useState<number>(300);
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);
  const [layout, setLayout] = useState<string>(
    window.innerWidth > 1100 ? 'layout' : 'layoutColumn',
  );
  const [currentHistory, setCurrentHistory] = useState<HistoryLog>({});
  const [resourceData, setResourceData] = useState<ResourceDataType[]>([
    {
      index: moment().valueOf(),
      key: '',
      value: '',
    },
  ]);

  useEffect(() => {
    const logs = getFromStorage('sig-sigUrl');
    setHistoryLog(logs);
  }, []);

  useEffect(() => {
    changeLayout();
    window.addEventListener('resize', changeLayout);
    return () => window.removeEventListener('resize', changeLayout);
  }, []);

  const changeLayout = () => {
    const layoutHW: HTMLElement = document.getElementById('layout') as HTMLElement;
    if (layoutHW.offsetWidth < 1100) {
      setLayout('layoutColumn');
    }
    if (layoutHW.offsetWidth > 1100) {
      setLayout('layout');
    }
  };

  // signature
  const sig = (canon: string, sk: string | undefined): string => {
    return computeSignature(sk, canon);
  };

  const submit = (v: Partial<FormValue>, e: any): any => {
    if (!e) {
      const date = moment().unix() + expireTime;
      const links = v?.Link?.trim()?.split('\n');
      const tempResourceData = sortBy(resourceData, (i) => i.key);
      const urls: string[] = [];
      const canonicalStrings: string[] = [];

      try {
        links?.forEach((i) => {
          const j = new URL(i);
          let query;
          console.log(tempResourceData);
          if (
            tempResourceData?.length > 0 &&
            tempResourceData[0].value &&
            tempResourceData[0].key
          ) {
            query = tempResourceData.map((g) => `${g.key}=${g.value}`).join('&');
          }

          const canonicalString = formatForm({
            ...v,
            Method: 'GET',
            Date: date,
            headers: [],
            resource: `/${v?.Bucket ? v.Bucket : j.host.split('.')[0]}${j.pathname}${
              query ? `?${query}` : ''
            }`,
          });

          const signature = sig(canonicalString, v.AccessKeySecret);

          const url = buildUrl(v.AccessKeyId, signature, date, i, query, v?.STSToken);

          urls.push(url);
          canonicalStrings.push(canonicalString);
        });

        const history: HistoryLog[] | [] = historyLog;
        if (history instanceof Array) {
          // @ts-ignore
          history.unshift({
            timeStamp: new Date().valueOf(),
            canon:
              canonicalStrings?.length > 1
                ? canonicalStrings.join('\n-----------------\n')
                : canonicalStrings.toString(),
            url: urls?.length > 1 ? urls.join('\n-----------------\n') : urls.toString(),
          });
          setHistoryLog([...history]);
          setCurrentHistory(history[0]);
          saveToStorage(`sig-sigUrl`, JSON.stringify(history));

          if (props?.onStateChange) {
            props.onStateChange('fulfilled');
          }
        }
      } catch (err) {
        console.log(err);
        Dialog.alert({
          title: intl('common.tool.warning'),
          content: intl('common.tool.sigUrl.link.regex'),
        });
      }
    }
  };

  const onExpireTimeChange = (v: number) => {
    setExpireTime(v);
  };

  return (
    <>
      <div className={styles[layout]} id="layout">
        <div className={styles.form}>
          <Form useLabelForErrorMessage>
            <Split
              title={intl('common.tool.privateKey')}
              content={
                <>
                  {intl('common.tooltip.akAndSk')}
                  <a
                    target="_blank"
                    href="https://ram.console.aliyun.com/manage/ak"
                    rel="noreferrer"
                  >
                    <span style={{ color: '#0064C8' }}>{intl('common.tool.akAndSk.ramPanel')}</span>
                    <Icon
                      style={{ color: '#0064C8', marginLeft: '4px' }}
                      type="external_link"
                      size={12}
                    />
                  </a>
                </>
              }
            >
              <FormItem {...formItemLayout} label="AccessKeyId" required>
                <Input placeholder={intl('common.tooltip.input')} name="AccessKeyId" />
              </FormItem>

              <FormItem {...formItemLayout} label="AccessKeySecret" required>
                <Input placeholder={intl('common.tooltip.input')} name="AccessKeySecret" />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Security-Token"
                help={
                  <>
                    {intl('common.tool.tooltip.stsToken')}
                    <a target="_blank" href="https://help.aliyun.com/document_detail/100624.html">
                      <span style={{ color: '#0064C8' }}>
                        {intl('common.tool.stsToken.generate')}
                      </span>
                      <Icon
                        style={{ color: '#0064C8', marginLeft: '4px' }}
                        type="external_link"
                        size={12}
                      />
                    </a>
                  </>
                }
              >
                <Input name="STSToken" placeholder={intl('common.tooltip.input')} />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={intl('common.tool.sigUrl.link.label')}
                required
                help={<pre>{intl('common.tool.sigUrl.link.help')}</pre>}
              >
                <Input.TextArea
                  placeholder="https://example.oss-cn-hangzhou.aliyuncs.com/test.txt"
                  name="Link"
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={`Bucket ${intl('name')}`}
                help={intl('tool.common.sigUrl.bucket.tip')}
                name="Bucket"
              >
                <Input type="text" />
              </FormItem>
            </Split>

            <Split
              title={intl('common.tool.other')}
              hide
              content={
                <>
                  {intl('common.tool.sigUrl.link.query.params')}
                  <a
                    href="https://help.aliyun.com/document_detail/31980.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span style={{ color: '#0064C8' }}>GetObject</span>
                    <Icon
                      style={{ color: '#0064C8', marginLeft: '4px' }}
                      type="external_link"
                      size={12}
                    />
                  </a>
                </>
              }
            >
              <QueryParams resourceData={resourceData} setResourceData={setResourceData} />
              <FormItem {...formItemLayout} label={intl('common.tool.expireTime.s')} required>
                <NumberPicker name="Expiration" value={expireTime} onChange={onExpireTimeChange} />
                <Input
                  style={{ width: '40px', borderLeft: '0' }}
                  disabled
                  value={intl('common.tool.second')}
                />
              </FormItem>
            </Split>

            <FormItem>
              <Form.Submit validate type="primary" onClick={submit}>
                {intl('common.tool.generateUrl')}
              </Form.Submit>
            </FormItem>
          </Form>
        </div>

        <div className={styles.view}>
          <div className={styles.history}>
            <SignatureHistory
              history={historyLog}
              prefix="sigUrl"
              setHistoryLog={setHistoryLog}
              content={currentHistory}
              clearContent={setCurrentHistory}
            />
          </div>
        </div>
      </div>
    </>
  );
};
