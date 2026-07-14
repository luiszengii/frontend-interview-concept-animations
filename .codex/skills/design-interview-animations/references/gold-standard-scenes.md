# Gold-standard scene patterns

These scenes are references for reasoning quality, not templates to copy. Preserve their design principles while inventing a different visual language for each new concept.

## 防抖 vs 节流

- Uses one shared event sequence and two time-based interpretations.
- Makes invisible timing rules visible as resettable timers, fixed windows, fire markers, and execution counts.
- Builds from pain to mechanism to an exact 1-vs-3 outcome, then maps the behavior to real use cases.
- Principle: when time is the concept, use a real timeline with measurable events rather than explanatory cards.

## 从输入 URL 到页面展示

- Treats the lifecycle as a relay race with persistent stations and a moving packet.
- Zooms into each station with domain-specific diagrams: DNS/IP, TCP handshake, TLS, request/response, DOM/CSSOM, layout, paint, composite.
- Keeps the global route visible while explaining local mechanics.
- Principle: for long sequential systems, combine a persistent overview with a changing detail panel.

## 实时通信：轮询 / 长轮询 / SSE / WebSocket

- Gives four alternatives the same client/server problem and shows them in synchronized lanes.
- Encodes direction, request frequency, held connections, and duplex behavior in the channel itself.
- Finishes with a decision rule grounded in message direction and interaction frequency.
- Principle: comparisons need a shared workload and shared visual scale; separate definition cards hide the real difference.

## Vite vs Webpack

- Places both tools on parallel tracks with the same module graph and task.
- Turns build strategy into physical behavior: Webpack consumes the graph before serving; Vite starts the server and responds to requested modules.
- Reuses the same track for startup and HMR, then adds production-build nuance.
- Principle: tool comparisons should animate the competing work models, not compare feature lists.

## 大文件上传优化

- Gives every engineering technique a concrete object: file, chunks, worker, hash, server, queue, retry state, progress bar, merge.
- Shows branches and failure recovery, not only the happy path.
- Preserves object identity across steps so the viewer can see skipped, uploading, failed, retried, completed, and merged chunks.
- Principle: resilient pipelines need persistent stateful objects and a visible failure path.

## Shared traits

- The concept owns the stage geometry.
- Persistent objects survive across several steps.
- Each step changes a visible state and explains a cause.
- The narration uses concrete numbers or events where possible.
- Edge cases and trade-offs appear before the final summary.
- The final line compresses the mechanism into an interview-ready mental model.

## Anti-patterns

- Three generic cards connected by arrows for every topic.
- Replacing only titles and colors while keeping identical motion.
- Re-rendering an entirely new composition at every step with no persistent object identity.
- Narration that lists APIs without showing when or why state changes.
- Decorative pulsing, gradients, or icons that do not encode a technical fact.
- A final summary that repeats the definition but omits boundaries or selection criteria.
