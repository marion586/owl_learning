const { Component, useState, onMounted, mount, xml, whenReady, useRef } = owl;

class Task extends Component {
  toggleTask() {
    this.props.task.isCompleted = !this.props.task.isCompleted;
  }
  static template = xml`
  

    <div class="task" t-att-class="props.task.isCompleted ? 'done' :''">
                <input type="checkbox" t-att-checked="props.task.isCompleted" t-on-click="toggleTask"/>
                <span><t t-esc="props.task.text"/></span>
           
                 <span class="delete" t-on-click="deleteTask">🗑</span>
            </div>`;

  static props = ["task", "onDelete"];

  deleteTask() {
    this.props.onDelete(this.props.task);
  }
}

class Root extends Component {
  static template = xml`
  <input placeholder="Enter a new task" t-on-keyup="addTask" t-ref="add-input"/>
    <div class="task-list">
        <t t-foreach="tasks" t-as="task" t-key="task.id">
            <Task task="task" onDelete.bind="deleteTask"/>
        </t>
    </div>`;

  deleteTask(task) {
    const index = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks.splice(index, 1);
  }
  nextId = 1;
  tasks = useState([]);
  addTask(ev) {
    // 13 is keycode for ENTER
    if (ev.keyCode === 13) {
      const text = ev.target.value.trim();
      ev.target.value = "";
      if (text) {
        const newTask = {
          id: this.nextId++,
          text: text,
          isCompleted: false,
        };
        this.tasks.push(newTask);
      }
      // todo
      console.log(this.tasks);
    }
  }

  static components = { Task };

  setup() {
    const inputRef = useRef("add-input");
    console.log("setup");
    onMounted(() => inputRef.el.focus());
  }
}

whenReady(() => {
  mount(Root, document.body, { dev: true });
});

(function () {
  console.log("hello owl", owl.__info__.version);
})();
