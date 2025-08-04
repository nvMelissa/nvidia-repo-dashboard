# PR Metrics Guide

## Overview
This document explains the key Pull Request (PR) metrics displayed in your dashboard and how to interpret them for improving development team efficiency and delivery cadence.

---

## 📊 Core PR Metrics

### 1. **Cycle Time**
**Definition:** The time from the first commit on a feature branch until that code is merged into the main branch.

**What it measures:**
- Total development velocity from start to finish
- End-to-end efficiency of your development process
- How quickly features move from conception to production

**Calculation:** 
```
Start: First commit timestamp on feature branch
End: Merge commit timestamp to main branch
Result: Duration in days
```

**Industry Benchmarks:**
- **Elite performers:** < 1 day
- **High performers:** 1-7 days  
- **Medium performers:** 1 week - 1 month
- **Low performers:** 1-6 months

**Why it matters:**
- Shorter cycle times = faster feature delivery
- Identifies bottlenecks in the development process
- Reduces integration risks with smaller, faster cycles
- Enables quicker feedback and iteration

**How to improve:**
- Break large features into smaller, focused changes
- Implement continuous integration practices
- Automate testing and deployment processes
- Reduce work-in-progress to focus on completion
- Improve code review processes

---

### 2. **Review Time (PR to Approval)**
**Definition:** The time from when a Pull Request is opened until it receives final approval and is ready to merge.

**What it measures:**
- Efficiency of your code review process
- How quickly your team provides feedback
- Bottlenecks in the approval workflow

**Calculation:**
```
Start: Pull Request creation timestamp
End: Final approval timestamp
Result: Duration in days
```

**Industry Benchmarks:**
- **Fast teams:** < 4 hours
- **Good teams:** 4-24 hours
- **Average teams:** 1-3 days
- **Slow teams:** > 1 week

**What's included:**
- Initial review wait time
- Review discussion and feedback rounds
- Developer response time to address comments
- Re-review cycles
- Final approval time

**What's excluded:**
- Time after approval to actual merge
- CI/CD pipeline execution time
- Deployment time

**Why it matters:**
- Long review times slow down entire development process
- Affects developer experience and motivation
- Indicates team collaboration effectiveness
- Shows if review process needs optimization

**How to improve:**
- Set clear review assignment and rotation policies
- Use smaller, focused PRs that are easier to review
- Implement automated checks to handle basic validation
- Establish review time expectations and SLAs
- Provide clear PR descriptions and context
- Use draft PRs for early feedback

---

### 3. **PR Throughput**
**Definition:** The number of Pull Requests merged per developer per week.

**What it measures:**
- Individual and team productivity
- Development velocity and capacity
- Delivery cadence consistency

**Calculation:**
```
PRs merged by developer in time period / Number of weeks
Example: 25 PRs merged in 5 weeks = 5 PRs/developer/week
```

**Typical ranges:**
- **High productivity:** 8-15 PRs/week
- **Average productivity:** 4-8 PRs/week
- **Lower productivity:** 1-4 PRs/week

**Factors affecting throughput:**
- PR size and complexity
- Review process efficiency
- Developer experience level
- Task complexity and scope
- Team availability and focus

**Why it matters:**
- Indicates sustainable development pace
- Helps with capacity planning and estimation
- Shows individual contribution patterns
- Identifies potential blockers or inefficiencies

**How to improve:**
- Encourage smaller, more frequent PRs
- Reduce context switching between tasks
- Automate repetitive development tasks
- Improve development environment setup
- Focus on completing work rather than starting new work
- Remove blockers and dependencies quickly

---

### 4. **Average PR Size**
**Definition:** The median number of lines of code (added + deleted) per Pull Request.

**What it measures:**
- Code change complexity and scope
- Development practices and habits
- Review difficulty and risk level

**Calculation:**
```
(Lines added + Lines deleted) per PR
Median value across all PRs in time period
```

**Recommended ranges:**
- **Ideal:** 50-200 lines
- **Acceptable:** 200-400 lines
- **Large:** 400-800 lines
- **Too large:** > 800 lines

**Why it matters:**
- Smaller PRs are reviewed faster and more thoroughly
- Large PRs increase risk of bugs and integration issues
- Size affects review quality and thoroughness
- Impacts merge conflicts and integration complexity

**Benefits of smaller PRs:**
- Faster review cycles
- Better code quality through thorough review
- Easier to understand and reason about
- Lower risk of introducing bugs
- Simpler rollback if issues occur
- Better collaboration and knowledge sharing

**How to improve:**
- Break large features into smaller, logical chunks
- Use feature flags for incremental delivery
- Separate refactoring from new feature work
- Focus on single responsibility per PR
- Use stacked PRs for related changes
- Plan work to enable smaller, independent changes

---

### 5. **Work in Progress (WIP)**
**Definition:** The average number of open Pull Requests per developer at any given time.

**What it measures:**
- Context switching and multitasking levels
- Focus and completion effectiveness
- Potential for developer burnout

**Calculation:**
```
Total open PRs across team / Number of active developers
```

**Recommended levels:**
- **Optimal:** 1-2 open PRs per developer
- **Acceptable:** 2-3 open PRs per developer
- **High:** 3-4 open PRs per developer
- **Too high:** > 4 open PRs per developer

**Why it matters:**
- High WIP leads to context switching overhead
- Reduces focus and increases time to completion
- Can cause developer stress and burnout
- Indicates potential process or planning issues

**Problems with high WIP:**
- Increased context switching costs
- Longer cycle times for all work
- Higher chance of merge conflicts
- Reduced code quality due to divided attention
- Developer frustration and burnout

**How to improve:**
- Implement WIP limits per developer
- Focus on completing work before starting new tasks
- Improve planning to reduce dependencies
- Address blockers quickly to prevent stalled work
- Use pair programming to distribute knowledge
- Better task estimation and capacity planning

---

## 📈 Charts and Visualizations

### **Cycle & Review Time Trends**
- **Purpose:** Shows how cycle time and review time change over weeks
- **How to read:** Look for trends, spikes, and patterns
- **Good trends:** Consistent or decreasing times
- **Red flags:** Increasing trends or high volatility

### **PR Throughput by Developer**
- **Purpose:** Compares individual developer productivity
- **How to read:** Bar chart showing PRs merged per developer
- **Use for:** Identifying training needs, workload balancing, or process issues
- **Note:** Consider context like task complexity and developer role

### **Developer Performance Table**
- **Columns explained:**
  - **PRs Merged:** Total count in time period
  - **Avg Cycle Time:** Personal average from commit to merge
  - **Avg Review Time:** Personal average from PR to approval
  - **Avg PR Size:** Personal average lines changed
  - **Open PRs:** Current work in progress (color-coded)

---

## 🎯 Using These Metrics Effectively

### **Best Practices:**
1. **Track trends, not just snapshots** - Look at changes over time
2. **Consider context** - Account for project complexity and team changes
3. **Use for improvement, not punishment** - Focus on process optimization
4. **Balance all metrics** - Don't optimize one at the expense of others
5. **Regular review** - Discuss metrics in team retrospectives

### **Warning Signs:**
- **Increasing cycle times** - Process bottlenecks developing
- **High review times** - Review process needs attention  
- **Decreasing throughput** - Team capacity or motivation issues
- **Growing PR sizes** - Development practices need refinement
- **High WIP counts** - Focus and planning problems

### **Common Improvements:**
- **Automated testing** - Reduces review burden and cycle time
- **Clear coding standards** - Speeds up reviews and reduces back-and-forth
- **Better planning** - Enables smaller, more focused PRs
- **Review guidelines** - Sets expectations for review speed and quality
- **Continuous integration** - Catches issues early and automates checks

---

## 📋 Action Items Checklist

When reviewing your PR metrics, consider these questions:

**Cycle Time:**
- [ ] Are cycle times trending upward?
- [ ] What's causing delays from commit to merge?
- [ ] Can we break down large features into smaller chunks?

**Review Time:**
- [ ] Are PRs sitting too long without review?
- [ ] Do we need clearer review assignment processes?
- [ ] Are PR descriptions providing enough context?

**Throughput:**
- [ ] Is throughput sustainable or showing signs of burnout?
- [ ] Are there significant variations between team members?
- [ ] What blockers are preventing PR completion?

**PR Size:**
- [ ] Are PRs too large for effective review?
- [ ] Can we encourage smaller, more focused changes?
- [ ] Do we need better feature decomposition practices?

**Work in Progress:**
- [ ] Are developers juggling too many concurrent tasks?
- [ ] What's causing PRs to remain open for extended periods?
- [ ] Do we need WIP limits or better prioritization?

---

## 🔗 Related Resources

- **Developer Efficiency Metrics:** These PR metrics align with developer efficiency best practices
- **Lean Software Development:** WIP limits and flow optimization principles
- **Code Review Best Practices:** Guidelines for effective and efficient reviews
- **Continuous Integration:** Automation practices that improve cycle times

---

*This guide helps teams understand and improve their development velocity through data-driven insights into pull request workflows and developer productivity.*