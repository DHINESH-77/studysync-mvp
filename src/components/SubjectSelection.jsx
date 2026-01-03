import { useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

const subjectsByDepartment = {
  cse: [
    { id: 'ds', name: 'Data Structures', semester: 3, color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-700' },
    { id: 'os', name: 'Operating Systems', semester: 4, color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { id: 'cn', name: 'Computer Networks', semester: 5, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700' },
    { id: 'dbms', name: 'Database Management Systems', semester: 4, color: 'bg-indigo-500', lightColor: 'bg-indigo-50', textColor: 'text-indigo-700' },
    { id: 'se', name: 'Software Engineering', semester: 6, color: 'bg-teal-500', lightColor: 'bg-teal-50', textColor: 'text-teal-700' }
  ],
  ece: [
    { id: 'signals', name: 'Signals & Systems', semester: 4, color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-700' },
    { id: 'dsp', name: 'Digital Signal Processing', semester: 5, color: 'bg-pink-500', lightColor: 'bg-pink-50', textColor: 'text-pink-700' },
    { id: 'comm', name: 'Communication Systems', semester: 6, color: 'bg-cyan-500', lightColor: 'bg-cyan-50', textColor: 'text-cyan-700' }
  ],
  eee: [
    { id: 'circuits', name: 'Electric Circuits', semester: 3, color: 'bg-yellow-500', lightColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
    { id: 'machines', name: 'Electric Machines', semester: 4, color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-700' },
    { id: 'power', name: 'Power Systems', semester: 5, color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-700' }
  ],
  me: [
    { id: 'thermo', name: 'Thermodynamics', semester: 3, color: 'bg-rose-500', lightColor: 'bg-rose-50', textColor: 'text-rose-700' },
    { id: 'fluid', name: 'Fluid Mechanics', semester: 4, color: 'bg-violet-500', lightColor: 'bg-violet-50', textColor: 'text-violet-700' },
    { id: 'heat', name: 'Heat Transfer', semester: 5, color: 'bg-lime-500', lightColor: 'bg-lime-50', textColor: 'text-lime-700' }
  ],
  ce: [
    { id: 'structures', name: 'Structural Analysis', semester: 4, color: 'bg-slate-500', lightColor: 'bg-slate-50', textColor: 'text-slate-700' },
    { id: 'concrete', name: 'Concrete Technology', semester: 5, color: 'bg-stone-500', lightColor: 'bg-stone-50', textColor: 'text-stone-700' },
    { id: 'geo', name: 'Geotechnical Engineering', semester: 6, color: 'bg-neutral-500', lightColor: 'bg-neutral-50', textColor: 'text-neutral-700' }
  ]
};

const departmentNames = {
  cse: 'Computer Science Engineering',
  ece: 'Electronics & Communication Engineering',
  eee: 'Electrical & Electronics Engineering',
  me: 'Mechanical Engineering',
  ce: 'Civil Engineering'
};

const SubjectSelection = () => {
  const { deptId } = useParams();
  const subjects = subjectsByDepartment[deptId] || [];
  const deptName = departmentNames[deptId];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link to="/dashboard" className="mr-4 p-3 hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-slate-800">{deptName}</h1>
            <p className="text-xl text-slate-600 mt-2">Select a subject to access study resources</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/subject/${deptId}/${subject.id}`}
              className="card group hover:scale-105 transform transition-all duration-300 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 ${subject.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-slate-900">{subject.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-3 py-1 ${subject.lightColor} ${subject.textColor} text-sm font-medium rounded-full`}>
                        Semester {subject.semester}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`w-full h-1 ${subject.color} rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;