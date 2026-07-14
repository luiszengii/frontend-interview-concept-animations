(function registerDistinctInterviewScenes(){
  window.SCENES=window.SCENES||[];
  const toggle=(root,selector,on,name="on")=>root.querySelector(selector)?.classList.toggle(name,!!on);

  window.SCENES.push({
    id:"ai-token-stream",title:"AI Token 流式渲染与中断",cat:"AI",css:"",
    html:`<div class="scene-ai-token-stream">
      <div class="ats-metrics"><span class="ats-metric">网络事件 <b data-ats="chunks">0</b></span><span class="ats-metric">React Commit <b data-ats="commits">0</b></span><span class="ats-metric">状态 <b data-ats="status">待发送</b></span></div>
      <div class="ats-timeline">
        <div class="ats-label">网络 Chunk</div><div class="ats-lane" data-ats="network"><span class="ats-chunk split">E4 BD</span><span class="ats-chunk split">A0 E5</span><span class="ats-chunk split">A5 BD</span><span class="ats-chunk">，我是你的</span><span class="ats-chunk">AI 助手。</span></div>
        <div class="ats-label">Decoder</div><div class="ats-lane"><div class="ats-buffer"><span class="ats-byte" data-byte-phase="2">E4</span><span class="ats-byte" data-byte-phase="2">BD</span><span class="ats-byte" data-byte-phase="2">A0</span><span class="ats-byte join" data-byte-phase="2">你</span><span class="ats-byte" data-byte-phase="2">E5</span><span class="ats-byte" data-byte-phase="3">A5</span><span class="ats-byte" data-byte-phase="3">BD</span><span class="ats-byte join" data-byte-phase="3">好</span></div></div>
        <div class="ats-label">帧时钟</div><div class="ats-lane"><div class="ats-clock"><i class="ats-tick" data-frame="F1" style="left:18%"></i><i class="ats-tick" data-frame="F2" style="left:48%"></i><i class="ats-tick" data-frame="F3" style="left:78%"></i></div></div>
        <div class="ats-label last">React UI</div><div class="ats-lane last"><div class="ats-commit"><b>Assistant</b><span class="ats-text" data-ats="text"></span><span class="ats-caret">▍</span></div></div>
      </div>
      <div class="ats-controller"><b>AbortController</b><span class="ats-signal"></span><span data-ats="server">模型任务未启动</span></div>
    </div>`,
    steps:[
      {phase:0,text:"",chunks:0,commits:0,status:"待发送",n:`用户点击发送，前端为这次生成创建独立的 <b>AbortController</b>。中断句柄从请求开始就存在，不是出错后才补。`},
      {phase:1,text:"",chunks:0,commits:0,status:"连接中",n:`响应头先返回并保持连接；模型结果会持续到达。<span class="hl-sync">首 Token 延迟</span>从发起请求到第一次可展示内容计算。`},
      {phase:2,text:"你",chunks:2,commits:0,status:"解码半包",n:`网络 Chunk 不等于 Token。汉字“你”的 UTF-8 字节被拆在两个 Chunk 中，调用 <b>decoder.decode(chunk, { stream: true })</b> 时会保留不完整字节，等后续 Chunk 到达再拼成字符。`},
      {phase:3,text:"你好，我是你的",chunks:4,commits:2,status:"帧级合并",n:`解码后的增量先进入待提交队列；用 <b>requestAnimationFrame</b> 把同一帧内的多个片段合并，4 次网络到达只产生 2 次 UI Commit。`},
      {phase:4,text:"你好，我是你的 AI 助手。",chunks:5,commits:3,status:"完成",n:`最后一帧提交完整文本。Markdown 代码块尚未闭合时可先按纯文本展示，结束标记到达后再做最终解析。`},
      {phase:5,text:"你好，我是你的",chunks:4,commits:2,status:"已中断",abort:true,n:`用户切换会话或点击停止时调用 <b>abort()</b>：浏览器停止读取，服务端也要监听断连并取消模型任务，避免继续计算和计费。`},
      {phase:6,text:"你好，我是你的 AI 助手。",chunks:5,commits:3,status:"闭环",done:true,n:`面试闭环：<b>长连接 → 增量字节解码 → 帧级批量 Commit → 协作式中断</b>。用首 Token 延迟、Commit 次数和中断释放耗时衡量。`}
    ],
    apply(root,index){
      const step=this.steps[index];
      root.querySelector('[data-ats="chunks"]').textContent=step.chunks;
      root.querySelector('[data-ats="commits"]').textContent=step.commits;
      root.querySelector('[data-ats="status"]').textContent=step.status;
      root.querySelector('[data-ats="text"]').textContent=step.text;
      root.querySelectorAll(".ats-chunk").forEach((node,i)=>node.classList.toggle("on",i<step.chunks));
      root.querySelectorAll(".ats-byte").forEach((node)=>node.classList.toggle("on",step.phase>=Number(node.dataset.bytePhase)));
      root.querySelectorAll(".ats-tick").forEach((node,i)=>node.classList.toggle("fire",i<step.commits));
      toggle(root,".ats-caret",step.phase>=2&&!step.abort&&!step.done);
      toggle(root,".ats-controller",step.abort,"abort");
      root.querySelector('[data-ats="server"]').textContent=step.abort?"浏览器断流 · 服务端取消":step.phase===0?"模型任务未启动":step.done?"连接关闭 · usage 已记录":"模型生成中";
    }
  });

  window.SCENES.push({
    id:"context-window",title:"上下文 Token：滑动窗口与摘要压缩",cat:"AI",css:"",
    html:`<div class="scene-context-window">
      <div class="ctx-budget"><strong>Context 16k</strong><div class="ctx-rail"><i class="ctx-fill"></i></div><b data-ctx="used">0%</b></div>
      <div class="ctx-workbench">
        <section class="ctx-archive"><div class="ctx-title">原始会话 <span>可回查</span></div><div class="ctx-msg old">需求背景 · 1.2k</div><div class="ctx-msg old">方案讨论 · 1.8k</div><div class="ctx-msg old">工具结果 · 2.1k</div><div class="ctx-msg old">修订过程 · 1.5k</div><div class="ctx-msg archive">原文归档 #1–24</div></section>
        <div class="ctx-compressor"><span class="ctx-arrow">→</span><div class="ctx-machine">摘要器<br>schema</div><span class="ctx-arrow">→</span><div class="ctx-trace">summary.v3<br>source 1–24</div></div>
        <section class="ctx-window"><div class="ctx-title">本次请求 <span>固定容量</span></div><div class="ctx-msg lock">System Prompt · 1.0k</div><div class="ctx-msg ctx-summary">结构化摘要 · 0.8k</div><div class="ctx-msg recent">最近 4 轮 · 2.4k</div><div class="ctx-msg recent">当前问题 · 0.4k</div><div class="ctx-msg recent">回答预留 · 1.4k</div></section>
      </div>
      <div class="ctx-formula" data-ctx="formula">system + history + tools + input + output reserve ≤ context window</div>
    </div>`,
    steps:[
      {phase:0,used:28,n:`上下文预算包含 <b>System Prompt、历史消息、工具结果、当前输入和预留输出</b>。请求前按模型 tokenizer 统一计算，而不是只数用户问题。`},
      {phase:1,used:63,n:`会话持续追加，旧历史占据越来越多容量；前端估算用于提示，后端用模型对应 tokenizer 做最终校验。`},
      {phase:2,used:91,n:`达到阈值时不能直接删除最早消息。先标出目标、约束、关键实体等必须保留的信息，并为输出预留空间。`},
      {phase:3,used:91,compress:true,n:`这里演示应用自建的可审计摘要：较老的 1–24 轮进入摘要器，输出目标、事实、未完成事项等结构化字段。模型厂商的内建 compaction 也可降上下文，但结果可能是不透明 item。`},
      {phase:4,used:54,packed:true,n:`短摘要替换旧消息进入本次请求；System Prompt、最近 N 轮原文和当前问题仍保留，预算重新回到安全区。`},
      {phase:5,used:61,packed:true,trace:true,n:`摘要带版本和来源消息范围。模型需要细节时可按 source 1–24 回查原始记录，避免摘要变成不可验证的“新事实”。`},
      {phase:6,used:61,packed:true,trace:true,done:true,n:`高分回答要说清：<b>预算公式、触发阈值、保留策略、摘要 schema、回查机制</b>，并承认摘要漂移需要版本化和评估。`}
    ],
    apply(root,index){
      const step=this.steps[index];
      const fill=root.querySelector(".ctx-fill");
      fill.style.width=step.used+"%"; fill.classList.toggle("warn",step.used>80);
      root.querySelector('[data-ctx="used"]').textContent=step.used+"%";
      root.querySelectorAll(".ctx-msg.old").forEach((node)=>{node.classList.toggle("pick",step.phase>=2&&step.phase<4);node.classList.toggle("gone",!!step.packed);});
      toggle(root,".ctx-machine",!!step.compress);
      toggle(root,".ctx-summary",!!step.packed);
      toggle(root,".ctx-trace",!!step.trace);
      root.querySelector('[data-ctx="formula"]').textContent=step.done?"保留近期原文 + 可回查摘要；不要用粗暴截断伪装上下文管理":"system + history + tools + input + output reserve ≤ 16k";
    }
  });

  window.SCENES.push({
    id:"react-skill-flow",title:"ReAct 循环与业务 Skill 设计",cat:"AI",css:"",
    html:`<div class="scene-react-skill-flow">
      <div class="rsf-orbit"><div class="rsf-loop"></div><div class="rsf-node rsf-goal">用户目标</div><div class="rsf-node rsf-reason">Reason<br>选择下一步</div><div class="rsf-node rsf-act">Act<br>调用 Skill</div><div class="rsf-node rsf-observe">Observe<br>验证结果</div><i class="rsf-runner"></i><div class="rsf-cycle">循环<b data-rsf="cycle">0</b></div></div>
      <div class="rsf-side"><div class="rsf-registry"><b>Skill Registry</b><div class="rsf-skill" data-skill="权限校验">权限校验 · schema</div><div class="rsf-skill" data-skill="知识库检索">知识库检索 · topK</div><div class="rsf-skill" data-skill="查询改写">查询改写 · retry</div></div><div class="rsf-observation">等待 Observation</div><div class="rsf-answer">最终答案：合同第 8 页退款条款……<br><small>citation · trace · cost</small></div></div>
    </div>`,
    steps:[
      {at:"goal",cycle:0,n:`用户问“这份合同里的退款条款是什么”。Agent 先保存目标和约束，不直接凭模型记忆生成答案。`},
      {at:"reason",cycle:1,n:`第 1 轮 Reason：判断必须先确认当前租户和知识库访问权限。编排层保留决策状态，不把敏感思维过程原样暴露给前端。`},
      {at:"act",cycle:1,skill:"权限校验",n:`Act：从 Registry 选择“权限校验” Skill。官方定义的 Skill 是带 SKILL.md 的版本化文件包；在本项目约定中，再固化输入 schema、权限边界、工具实现和结构化返回。`},
      {at:"observe",cycle:1,obs:"ALLOW tenant_A / kb_12",confidence:"high",n:`Observe：得到可验证的授权结果。Agent 把观察写入运行态，再进入下一轮，而不是让工具直接决定最终答案。`},
      {at:"reason",cycle:2,n:`第 2 轮 Reason：已有授权证据，现在需要检索退款条款原文和页码。`},
      {at:"act",cycle:2,skill:"知识库检索",n:`Act：调用知识库检索 Skill，统一传入 query、tenantId、kbId、topK，并要求返回 chunk、位置和分数。`},
      {at:"observe",cycle:2,obs:"score 0.42 · 命中不可靠",confidence:"low",retry:true,n:`低置信度 Observation 不能直接生成答案。橙色回路表示进入重试分支：改写查询或请求澄清，而不是把低质量召回包装成事实。`},
      {at:"act",cycle:3,skill:"查询改写",retry:true,n:`第 3 轮 Act：保留上一轮证据，调用查询改写 Skill，把“退款”扩展为“解除、退费、终止服务”后再次检索。`},
      {at:"observe",cycle:3,obs:"score 0.91 · 第 8 页",confidence:"high",done:true,n:`高置信度结果通过终止条件，循环退出并生成带页码引用的答案。<b>在本项目设计里，Skill 承载能力约定，ReAct 负责循环选择和验证能力</b>。`}
    ],
    apply(root,index){
      const step=this.steps[index],runner=root.querySelector(".rsf-runner");
      runner.className="rsf-runner at-"+step.at+(step.retry?" retry":"");
      root.querySelector('[data-rsf="cycle"]').textContent=step.cycle;
      root.querySelectorAll(".rsf-node").forEach((node)=>node.classList.toggle("on",node.classList.contains("rsf-"+step.at)));
      root.querySelectorAll(".rsf-skill").forEach((node)=>node.classList.toggle("on",node.dataset.skill===step.skill));
      const observation=root.querySelector(".rsf-observation"); observation.textContent=step.obs||"等待 Observation"; observation.className="rsf-observation "+(step.confidence||"");
      toggle(root,".rsf-answer",!!step.done);
    }
  });

  window.SCENES.push({
    id:"tenant-runtime",title:"单镜像多租户：运行时主题与 Feature Flag",cat:"工程化",css:"",
    html:`<div class="scene-tenant-runtime">
      <div class="tn-source"><div class="tn-image">📦<b>app:v2.8.0</b><div class="tn-digest">sha256:7f3a…c91</div></div><div class="tn-config">tenant-config.json<br><span data-tn="config">等待租户标识</span></div><div class="tn-beam"></div></div>
      <div class="tn-products"><div class="tn-app" data-tenant="acme" style="--brand:#12b981"><div class="tn-app-head"><span class="tn-logo">A</span><span>Acme 医疗</span><small>同一 digest</small></div><div><span class="tn-feature">知识库</span><span class="tn-feature">审计日志</span><span class="tn-feature">场景编排</span></div><div class="tn-chunk">medical-report.js</div></div><div class="tn-app" data-tenant="nova" style="--brand:#a855f7"><div class="tn-app-head"><span class="tn-logo">N</span><span>Nova 教育</span><small>同一 digest</small></div><div><span class="tn-feature">知识库</span><span class="tn-feature">课程助手</span><span class="tn-feature">场景编排</span></div><div class="tn-chunk">course-agent.js</div></div><div class="tn-proof"><span>镜像数 1</span><span>运行时 CSS Variables</span><span>Flag 不是安全边界</span><span>专属 chunk 按需加载</span></div></div>
    </div>`,
    steps:[
      {phase:0,n:`构建阶段只产出一套通用镜像。两位客户看到的镜像 digest 完全相同，差异不写死在构建环境变量里。`},
      {phase:1,tenant:"acme",n:`请求根据域名或登录上下文解析 tenantId。租户标识只选择配置，不选择另一份前端产物。`},
      {phase:2,tenant:"acme",config:true,n:`初始化拉取带版本的租户配置：品牌 Token、Feature Flag、路由能力和扩展模块清单；失败时使用安全默认值并记录配置版本。`},
      {phase:3,tenant:"acme",config:true,theme:true,n:`把品牌主色写入 CSS Variables，组件消费语义 Token。同一个 DOM 和 CSS 立即变成 Acme 品牌，不重新编译。`},
      {phase:4,tenant:"acme",config:true,theme:true,flags:true,n:`Feature Flag 关闭“场景编排”，只控制入口和体验。接口仍按 tenantId、资源归属和权限判定，Flag 不能充当安全边界。`},
      {phase:5,tenant:"acme",config:true,theme:true,flags:true,chunk:true,n:`配置启用医疗报告能力后才 <b>dynamic import</b> 专属 chunk；Nova 不下载 medical-report.js，公共首包保持稳定。`},
      {phase:6,tenant:"both",config:true,theme:true,flags:true,chunk:true,done:true,n:`同一镜像同时服务不同品牌与能力组合。收益用镜像数量、发布时间、首包体积和运维工时衡量，而不是只说“支持换肤”。`}
    ],
    apply(root,index){
      const step=this.steps[index]; toggle(root,".tn-config",!!step.config);toggle(root,".tn-beam",step.phase>=1);
      root.querySelector('[data-tn="config"]').textContent=step.tenant==="both"?"Acme + Nova 配置并行":step.tenant?`tenant=${step.tenant} · config v18`:"等待租户标识";
      root.querySelectorAll(".tn-app").forEach((app)=>{const selected=step.tenant==="both"||app.dataset.tenant===step.tenant;app.classList.toggle("active",!!step.theme&&selected);app.querySelectorAll(".tn-feature").forEach((feature,i)=>{feature.classList.toggle("on",!!step.flags&&selected&&i<2);feature.classList.toggle("off",!!step.flags&&selected&&i===2);});app.querySelector(".tn-chunk").classList.toggle("on",!!step.chunk&&selected);});
    }
  });

  window.SCENES.push({
    id:"next-request-chain",title:"Next.js Proxy（原 Middleware）、SSR 与 Hydration",cat:"工程化",css:"",
    html:`<div class="scene-next-request-chain"><div class="nx-browser">Browser<br><small>GET /dashboard</small></div><div class="nx-middleware"><span>Proxy<br><small>原 Middleware</small><br>cookie / tenant</span></div><div class="nx-stop">302 /login<br><small>拒绝分支</small></div><div class="nx-success"><div class="nx-node nx-server">Server Render<small>RSC / SSR data</small></div><div class="nx-node nx-html">HTML 首屏<small>先可见</small></div><div class="nx-node nx-hydrate">Hydration<small>绑定交互</small></div></div><i class="nx-wire in"></i><i class="nx-wire deny"></i><i class="nx-wire allow"></i><i class="nx-packet"></i></div>`,
    steps:[
      {phase:0,n:`浏览器请求租户后台页面。SSR 的价值是提前产出首屏 HTML，不代表所有页面都应该强制服务端渲染。`},
      {phase:1,n:`请求先抵达 <b>Proxy</b>：读取 cookie、识别租户、执行轻量 redirect / rewrite。Next.js 16 起 <code>middleware</code> 文件约定已改名为 <code>proxy</code>，面试里仍常沿用旧称。`},
      {phase:2,deny:true,n:`未登录时决策菱形走红色分支，直接返回 <b>302 /login</b>。请求不会继续进入页面渲染；真正的数据权限仍需服务端校验。`},
      {phase:3,allow:true,n:`重新观察已登录请求：Proxy 通过 header、cookie、rewrite 或 URL 把上下文传给后续路由，绿色分支进入 Server Component 或 SSR。`},
      {phase:4,allow:true,n:`服务端并行读取首屏数据并渲染 HTML。服务端已经拿到的数据不要在客户端无条件重复请求一次。`},
      {phase:5,allow:true,n:`浏览器先收到可见 HTML，LCP 可以更早；随后只下载需要交互的客户端 JavaScript。TTFB 变长与服务器成本是 SSR 的代价。`},
      {phase:6,allow:true,n:`Hydration 将事件和客户端状态绑定到现有 HTML。服务端与客户端首屏输出必须一致，否则会出现 hydration mismatch。`},
      {phase:7,allow:true,done:true,n:`面试边界：<b>Proxy（原 Middleware）决策请求去向；SSR / RSC 生成内容；Hydration 接管交互</b>。用 TTFB、LCP、客户端 JS 体积与 SEO 收益评估。`}
    ],
    apply(root,index){
      const step=this.steps[index];root.classList.toggle("deny",!!step.deny);root.classList.toggle("allow",!!step.allow);
      root.classList.toggle("done",!!step.done);
      const packet=root.querySelector(".nx-packet");packet.className="nx-packet"+(step.deny?" denied":step.phase===1?" at-mw":step.phase===3?" allowed":step.phase===4?" render":step.phase===5?" html":step.phase>=6?" hydrate":"");
      toggle(root,".nx-stop",!!step.deny);toggle(root,".nx-server",step.phase>=4);toggle(root,".nx-html",step.phase>=5);toggle(root,".nx-hydrate",step.phase>=6);
    }
  });

  window.SCENES.push({
    id:"axios-sse-pipeline",title:"统一请求层：Axios 拦截器与 SSE 分流",cat:"工程化",css:"",
    html:`<div class="scene-axios-sse-pipeline"><div class="rp-caller"><b>业务调用</b><span>领域参数 + AbortSignal</span></div><div class="rp-policy"><b>共享策略</b><span class="rp-policy-item">auth + tenant</span><span class="rp-policy-item">camel → snake</span><span class="rp-policy-item">trace + timeout</span></div><div class="rp-lane rp-json"><i class="rp-route"></i><b>Axios / JSON</b><p>幂等重试 · 401 刷新</p><div class="rp-refresh">1 个 refresh 飞行中<br>其余请求排队</div></div><div class="rp-lane rp-stream"><i class="rp-route"></i><b>fetch / Stream</b><p>增量解码 · abort · done</p><div class="rp-half">chunk: "data: {\"te"<br>buffer 等待完整事件</div></div><div class="rp-output"><b>领域契约</b><code data-rp="output">{ data, error, traceId }</code></div></div>`,
    steps:[
      {phase:0,n:`业务组件只提交领域参数和可选 AbortSignal；鉴权头、租户、命名转换、重试与错误模型由请求层收口。`},
      {phase:1,policy:true,n:`共享策略层注入 auth、tenantId、traceId，并把普通 JSON 的 camelCase 转为 snake_case；FormData、Blob 等特殊类型必须跳过递归转换。`},
      {phase:2,policy:true,lane:"json",n:`普通 JSON / Blob 请求走 Axios 分支。只有幂等操作可按策略重试；写操作需要幂等键，不能因为网络错误就盲目重复提交。`},
      {phase:3,policy:true,lane:"json",refresh:true,n:`多个请求同时收到 401 时，只允许一个刷新 Token 请求飞行，其余请求排队；刷新成功后重放，避免刷新风暴。`},
      {phase:4,policy:true,lane:"stream",n:`流式对话从同一个策略节点分叉到 fetch / ReadableStream。它共享鉴权与 trace，但不强迫 Axios 承担浏览器流式读取。`},
      {phase:5,policy:true,lane:"stream",half:true,n:`Stream 分支必须处理半包、事件边界、结束标记和 AbortController。图中半截 JSON 留在 buffer，等下一块到达后再解析。`},
      {phase:6,policy:true,lane:"both",done:true,n:`两条 transport 最后汇合成稳定领域契约。高分点是：<b>统一策略和输出，不统一不适合统一的传输实现</b>。`}
    ],
    apply(root,index){
      const step=this.steps[index];toggle(root,".rp-policy",!!step.policy);toggle(root,".rp-json",step.lane==="json"||step.lane==="both");toggle(root,".rp-stream",step.lane==="stream"||step.lane==="both");toggle(root,".rp-refresh",!!step.refresh);toggle(root,".rp-half",!!step.half);toggle(root,".rp-output",!!step.done);
      root.querySelector('[data-rp="output"]').textContent=step.lane==="stream"?"{ type: 'delta' | 'done', traceId }":step.done?"Result<T> | StreamEvent<T>":"{ data, error, traceId }";
    }
  });

  window.SCENES.push({
    id:"rbac-defense",title:"RBAC：路由、组件、接口三层权限闭环",cat:"工程化",css:"",
    html:`<div class="scene-rbac-defense"><div class="rb-principal"><b>user_42</b><span class="rb-token">kb:view</span><span class="rb-token" data-rb="delete">kb:delete</span><span class="muted">tenant_A</span></div><div class="rb-fort"><div class="rb-gate rb-route"><b>路由门</b>kb:view<div class="rb-detail">控制页面和 chunk</div></div><div class="rb-gate rb-ui"><b>组件门</b>kb:delete<div class="rb-detail">控制删除入口</div></div><div class="rb-gate rb-api"><b>API 金库</b>权限 + tenant + 资源归属<div class="rb-detail">真正安全边界</div></div><i class="rb-attack"></i></div><div class="rb-audit">等待权限决策…</div></div>`,
    steps:[
      {phase:0,perms:[],n:`登录后由后端返回角色与权限标识。前端不根据角色名称自行猜测权限，默认拒绝未知能力。`},
      {phase:1,perms:["kb:view"],route:true,n:`路由门检查 kb:view：有权限才加载知识库页面和对应 chunk；无权限跳转 403，减少无意义资源下载。`},
      {phase:2,perms:["kb:view"],route:true,ui:false,n:`组件门发现缺少 kb:delete，因此不渲染删除按钮。这是体验层防误操作，不是安全证明。`},
      {phase:3,perms:["kb:view"],route:true,attack:true,n:`攻击者绕过前端，直接构造 DELETE 请求。红线跳过组件门，说明任何前端检查都能被手工请求绕开。`},
      {phase:4,perms:["kb:view"],route:true,attack:true,blocked:true,n:`API 金库重新校验 kb:delete、tenantId 和资源归属，返回 403 并记录审计。真正的安全边界在服务端。`},
      {phase:5,perms:["kb:view","kb:delete"],route:true,ui:true,api:true,n:`授权用户拥有 kb:delete：入口可见，API 校验通过；多租户场景仍必须确认目标资源属于 tenant_A。`},
      {phase:6,perms:["kb:view","kb:delete"],route:true,ui:true,api:true,done:true,n:`完整闭环：<b>后端下发权限 → 路由体验拦截 → 组件收口 → API 强校验 → 审计日志</b>。前端负责体验，后端负责安全。`}
    ],
    apply(root,index){
      const step=this.steps[index],canDelete=step.perms.includes("kb:delete");
      root.querySelector('[data-rb="delete"]').style.display=canDelete?"inline-block":"none";
      root.querySelector(".rb-route").className="rb-gate rb-route "+(step.route?"open":"");
      root.querySelector(".rb-ui").className="rb-gate rb-ui "+(step.ui?"open":step.phase>=2?"closed":"");
      root.querySelector(".rb-api").className="rb-gate rb-api "+(step.blocked?"closed":step.api?"open":"");
      toggle(root,".rb-attack",!!step.attack);
      const audit=root.querySelector(".rb-audit");audit.className="rb-audit"+(step.blocked?" blocked":step.done?" on":"");audit.textContent=step.blocked?"403 · missing kb:delete · tenant_A/kb_12 · trace_8fd2":step.done?"200 · user_42 deleted tenant_A/kb_12 · audit saved":"等待权限决策…";
    }
  });
})();
