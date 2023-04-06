import { unified } from 'unified';
import { describe, test, expect } from 'vitest';
// 解析md的语法为AST
import remarkParse from 'remark-parse';
// 将md的AST解析为HTML的AST
import remarkRehype from 'remark-rehype';
// 将HTML的AST进行序列化，转化为HTML的字符串
import rehypeStringify from 'rehype-stringify';
import shiki from 'shiki';
import { rehypePluginPreWrapper } from '../plugin-mdx/rehypePlugins/preWrapper';
import { rehypePluginShiki } from '../../node/plugin-mdx/rehypePlugins/shiki';

describe('Markdown compile cases', async () => {
  // 初始化 processor，链式调用，注册插件
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePluginPreWrapper)
    .use(rehypePluginShiki, {
      highlighter: await shiki.getHighlighter({ theme: 'nord' })
    })
    .use(rehypeStringify);

  test('Compile title', async () => {
    const mdContent = '# 123';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot('"<h1>123</h1>"');
  });

  test('Compile code', async () => {
    const mdContent = 'I am using `Island.js`';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(
      '"<p>I am using <code>Island.js</code></p>"'
    );
  });
  // 测试 rehypePluginPreWrapper 插件
  test('Compile code block', async () => {
    const mdContent = '```js\nconsole.log(123);\n```';
    const result = processor.processSync(mdContent);
    expect(
      '<div class="language-js"><span class="lang">js</span><pre><code class="language-js">console.log(123)</code></pre></div>'
    ).toMatchInlineSnapshot(
      '"<div class=\\"language-js\\"><span class=\\"lang\\">js</span><pre><code class=\\"language-js\\">console.log(123)</code></pre></div>"'
    );
  });
  // 测试 rehypePluginShiki插件
  test('Compile code block2', async () => {
    const mdContent = '```js\nconsole.log(123);\n```';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(`
      "<div class=\\"language-js\\"><span class=\\"js\\">lang</span><pre class=\\"shiki nord\\" style=\\"background-color: #2e3440ff\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #B48EAD\\">123</span><span style=\\"color: #D8DEE9FF\\">)</span><span style=\\"color: #81A1C1\\">;</span></span>
      <span class=\\"line\\"></span></code></pre></div>"
    `);
  });
});
