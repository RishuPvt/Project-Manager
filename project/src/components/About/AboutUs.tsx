import React from "react";
import {
  Book,
  FileText,
  Kanban,
  Users,
  LayoutDashboard,
  Image,
  ClipboardList,
  ListTodo,
  Loader2,
  CheckCheck
} from "lucide-react";

const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center mb-4">
    {icon}
    <h2 className="text-2xl font-bold ml-2 text-gray-800">{title}</h2>
  </div>
);

const About = () => {
  return (
    <div className="px-4 md:px-8 py-12 max-w-6xl mx-auto bg-white text-gray-800">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-indigo-600">
          About KanbanFlow
        </h1>
        <p className="text-lg text-gray-600">
          A powerful project management tool designed to enhance team
          collaboration and productivity.
        </p>
      </div>

      {/* Project Overview */}
      <section className="mb-16">
        <SectionTitle icon={<Book className="h-6 w-6 text-indigo-500" />} title="Project Overview" />
        <div className="border-b border-gray-200 mb-6"></div>
        <div className="space-y-4 leading-relaxed">
          <p>
            KanbanFlow is a Kanban-style project management application designed to help teams visualize work, limit work-in-progress, and maximize efficiency.
          </p>
          <p>
            Built with React, TypeScript, and Tailwind CSS, it offers a modern, responsive interface for managing tasks and workflows.
          </p>
          <p>
            Our mission is to provide teams with a flexible, intuitive tool that adapts to their unique processes—not the other way around.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-16">
        <SectionTitle icon={<FileText className="h-6 w-6 text-indigo-500" />} title="Key Features" />
        <div className="border-b border-gray-200 mb-6"></div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: <LayoutDashboard className="h-5 w-5 text-indigo-600" />,
              title: "Flexible Kanban Boards",
              desc: "Customize columns and workflows to match your team's process.",
            },
            {
              icon: <Users className="h-5 w-5 text-indigo-600" />,
              title: "Team Collaboration",
              desc: "Real-time updates, comments, and collaborative task management.",
            },
            {
              icon: <Image className="h-5 w-5 text-indigo-600" />,
              title: "Visual Task Management",
              desc: "Color-coded cards, labels, and visual indicators for task status.",
            },
            {
              icon: <Kanban className="h-5 w-5 text-indigo-600" />,
              title: "Progress Tracking",
              desc: "Monitor project progress with analytics and reporting tools.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 bg-gray-50 rounded-lg border shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
   
<section className="mb-16">
  <SectionTitle icon={<Kanban className="h-6 w-6 text-indigo-500" />} title="Workflow" />
  <div className="border-b border-gray-200 mb-6"></div>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {[
      {
        title: "Backlog",
        color: "bg-pink-100",
        icon: <ClipboardList className="text-pink-600 w-5 h-5 mr-2" />,
        tasks: ["Feature request", "Bug report", "UI improvement"],
      },
      {
        title: "In Progress",
        color: "bg-blue-100",
        icon: <Loader2 className="text-blue-600 w-5 h-5 mr-2 animate-spin" />,
        tasks: ["API integration", "Critical bug fix"],
      },
      {
        title: "Review",
        color: "bg-yellow-100",
        icon: <ListTodo className="text-yellow-600 w-5 h-5 mr-2" />,
        tasks: ["Code review"],
      },
      {
        title: "Done",
        color: "bg-green-100",
        icon: <CheckCheck className="text-green-600 w-5 h-5 mr-2" />,
        tasks: ["New dashboard", "UI enhancements"],
      },
    ].map((column, index) => (
      <div
        key={index}
        className={`p-4 ${column.color} border border-gray-200 rounded-lg shadow-sm`}
      >
        <div className="flex items-center justify-center mb-3">
          {column.icon}
          <h3 className="font-semibold text-center text-gray-800">{column.title}</h3>
        </div>
        <div className="space-y-2">
          {column.tasks.map((task, idx) => (
            <div
              key={idx}
              className="p-2 bg-white rounded shadow text-sm text-gray-700"
            >
              {task}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Technical Documentation */}
      <section>
        <SectionTitle icon={<FileText className="h-6 w-6 text-indigo-500" />} title="Technical Documentation" />
        <div className="border-b border-gray-200 mb-6"></div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Tech Stack</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>React 18 with TypeScript</li>
              <li>React Router</li>
              <li>Tailwind CSS</li>
              <li>Lucide React for icons</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Architecture</h3>
            <p className="text-gray-700">
              KanbanFlow follows a modular architecture with reusable components and Context API for managing global state such as authentication and board data.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Key Components</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li><strong>AuthContext:</strong> Authentication handling</li>
              <li><strong>BoardContext:</strong> Task and board state logic</li>
              <li><strong>KanbanBoard:</strong> Renders workflow columns</li>
              <li><strong>Layout/Header:</strong> Global layout and navigation</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
