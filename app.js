const {
  Component,
  useState,
  onMounted,
  mount,
  xml,
  whenReady,
  useRef,
  reactive,
  useEnv,
} = owl;
function useStore() {
  const env = useEnv();
  return useState(env.store);
}

class TaskList {
  nextId = 1;
  tasks = [];

  addTask(text) {
    text = text.trim();
    if (text) {
      const task = {
        id: this.nextId++,
        text: text,
        isCompleted: false,
      };
      this.tasks.push(task);
    }
  }

  toggleTask(task) {
    task.isCompleted = !task.isCompleted;
  }

  deleteTask(task) {
    const index = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks.splice(index, 1);
  }
}

function createTaskStore() {
  return reactive(new TaskList());
}
class Task extends Component {
  static template = xml`
  

    <div class="task" t-att-class="props.task.isCompleted ? 'done' :''">
                <input type="checkbox" t-att-checked="props.task.isCompleted" t-on-click="()=>store.toggleTask(props.task)"/>
                <span><t t-esc="props.task.text"/></span>
           
                 <span class="delete" t-on-click="()=> store.deleteTask(props.task)">🗑</span>
            </div>`;

  static props = ["task"];

  deleteTask() {
    this.props.onDelete(this.props.task);
  }

  setup() {
    this.store = useStore();
  }
}

class Root extends Component {
  static template = xml`
  <input placeholder="Enter a new task" t-on-keyup="addTask" t-ref="add-input"/>
    <div class="task-list">
        <t t-foreach="store.tasks" t-as="task" t-key="task.id">
            <Task task="task" />
        </t>
    </div>`;

  static components = { Task };

  setup() {
    const inputRef = useRef("add-input");
    console.log("setup");
    onMounted(() => inputRef.el.focus());
    this.store = useStore();
  }

  addTask(ev) {
    if (ev.keyCode === 13) {
      this.store.addTask(ev.target.value);
      ev.target.value = "";
    }
  }
}

const env = {
  store: createTaskStore(),
};
whenReady(() => {
  mount(Root, document.body, { dev: true, env });
});

(function () {
  console.log("hello owl", owl.__info__.version);
})();
