import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const departments = [
  { id: 'cse', name: 'Computer Science Engineering', code: 'CSE', color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-700' },
  { id: 'ece', name: 'Electronics & Communication Engineering', code: 'ECE', color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  { id: 'eee', name: 'Electrical & Electronics Engineering', code: 'EEE', color: 'bg-amber-500', lightColor: 'bg-amber-50', textColor: 'text-amber-700' },
  { id: 'me', name: 'Mechanical Engineering', code: 'ME', color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-700' },
  { id: 'ce', name: 'Civil Engineering', code: 'CE', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700' }
];

const DepartmentSelection = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Choose Your Department</h1>
          <p className="text-xl text-slate-600">Select your engineering department to access study resources</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              to={`/department/${dept.id}`}
              className="card group hover:scale-105 transform transition-all duration-300 p-8"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 ${dept.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-2xl mb-2">{dept.code}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{dept.name}</p>
                </div>
                <div className={`w-full h-1 ${dept.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentSelection;