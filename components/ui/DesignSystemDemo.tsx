import { useState } from 'react';
import { User, Mail, Calendar, ArrowRight, Check, X } from 'lucide-react';
import Button from './button';
import Badge from './badge';
import Checkbox from './checkbox';
import Switch from './switch';
import InputText from './input-text';
import InputSelect from './input-select';

export default function DesignSystemDemo() {
  const [inputValue, setInputValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [selectValue, setSelectValue] = useState('');

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Apple-Inspired Design System</h1>
      
      {/* Color Palette */}
      <section className="mb-12">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Color Palette</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Primary Colors</h3>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <div className="h-16 rounded-lg bg-blue-500 mb-1"></div>
                <p className="text-xs text-gray-600">Primary</p>
              </div>
              <div>
                <div className="h-16 rounded-lg bg-blue-600 mb-1"></div>
                <p className="text-xs text-gray-600">Primary Dark</p>
              </div>
              <div>
                <div className="h-16 rounded-lg bg-blue-50 mb-1"></div>
                <p className="text-xs text-gray-600">Primary Light</p>
              </div>
              <div>
                <div className="h-16 rounded-lg bg-green-500 mb-1"></div>
                <p className="text-xs text-gray-600">Success</p>
              </div>
              <div>
                <div className="h-16 rounded-lg bg-red-500 mb-1"></div>
                <p className="text-xs text-gray-600">Error</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Neutral Colors</h3>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <div className="h-16 rounded-lg bg-gray-900 mb-1"></div>
                <p className="text-xs text-gray-600">Gray 900</p>
              </div>
              <div>
                <div className="h-16 rounded-lg bg-gray-700 mb-1"></div>
                <p className="text-xs text-gray-600">Gray 700</p>
              </div>
              <div>
                <div className="h-16 rounded-lg bg-gray-500 mb-1"></div>
                <p className="text-xs text-gray-600">Gray 500</p>
              </div>
              <div>
                <div className="h-16 rounded-lg bg-gray-300 mb-1"></div>
                <p className="text-xs text-gray-600">Gray 300</p>
              </div>
              <div>
                <div className="h-16 rounded-lg bg-gray-100 mb-1"></div>
                <p className="text-xs text-gray-600">Gray 100</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-semibold">Heading 1 (text-4xl)</h1>
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Heading 2 (text-3xl)</h2>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">Heading 3 (text-2xl)</h3>
          </div>
          <div>
            <h4 className="text-xl font-semibold">Heading 4 (text-xl)</h4>
          </div>
          <div>
            <h5 className="text-lg font-medium">Heading 5 (text-lg)</h5>
          </div>
          <div>
            <p className="text-base">Body (text-base) - The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div>
            <p className="text-sm">Small (text-sm) - The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div>
            <p className="text-xs">Extra Small (text-xs) - The quick brown fox jumps over the lazy dog.</p>
          </div>
        </div>
      </section>
      
      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Buttons</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="success">Success</Button>
              <Button variant="danger">Danger</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">With Icons</h3>
            <div className="flex flex-wrap gap-4">
              <Button icon={<ArrowRight size={16} />} iconPosition="right">Next</Button>
              <Button variant="success" icon={<Check size={16} />} iconPosition="left">Confirm</Button>
              <Button variant="danger" icon={<X size={16} />} iconPosition="left">Cancel</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Form Controls */}
      <section className="mb-12">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Form Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Text Inputs</h3>
              <div className="space-y-4">
                <InputText 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your name"
                  icon={<User size={16} />}
                />
                
                <InputText 
                  value="" 
                  onChange={() => {}}
                  placeholder="Disabled input"
                  icon={<Mail size={16} />}
                  disabled
                />
                
                <InputText 
                  value="" 
                  onChange={() => {}}
                  placeholder="Input with error"
                  icon={<Calendar size={16} />}
                  error="This field is required"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select</h3>
              <InputSelect
                value={selectValue}
                onChange={(e) => setSelectValue(typeof e === 'string' ? e : e.target.value)}
                options={selectOptions}
                label="Select an option"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Checkbox</h3>
              <div className="space-y-2">
                <Checkbox 
                  checked={checkboxValue} 
                  onChange={() => setCheckboxValue(!checkboxValue)}
                  label="I agree to the terms and conditions"
                />
                
                <Checkbox 
                  checked={true} 
                  onChange={() => {}}
                  label="Checked (disabled)"
                  disabled
                />
                
                <Checkbox 
                  checked={false} 
                  onChange={() => {}}
                  label="Checkbox with error"
                  error="Please accept the terms"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Switch</h3>
              <div className="space-y-3">
                <Switch 
                  checked={switchValue} 
                  onChange={() => setSwitchValue(!switchValue)}
                  label="Enable notifications"
                />
                
                <Switch 
                  checked={true} 
                  onChange={() => {}}
                  label="Enabled switch (disabled)"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Badges */}
      <section className="mb-12">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Badges</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Colors</h3>
            <div className="flex flex-wrap gap-2">
              <Badge text="Default" color="gray" />
              <Badge text="Blue" color="blue" />
              <Badge text="Green" color="green" />
              <Badge text="Red" color="red" />
              <Badge text="Yellow" color="yellow" />
              <Badge text="Purple" color="purple" />
              <Badge text="Indigo" color="indigo" />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Variants</h3>
            <div className="flex flex-wrap gap-2">
              <Badge text="Filled" color="blue" variant="filled" />
              <Badge text="Light" color="blue" variant="light" />
              <Badge text="Outline" color="blue" variant="outline" />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">With Icons</h3>
            <div className="flex flex-wrap gap-2">
              <Badge text="Success" color="green" icon={<Check size={12} />} />
              <Badge text="Error" color="red" icon={<X size={12} />} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 