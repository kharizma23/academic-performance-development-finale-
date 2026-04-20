import re

def check_jsx(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all tags, including multiline ones
    # Group 1: Opening tag name
    # Group 2: Self-closing slash /
    # Group 3: Closing tag name
    tags = re.finditer(r'<(div|main|Card|motion\.div|CardHeader|CardTitle|CardDescription|CardContent|AnimatePresence|Dialog|InterventionModal|StudentPredictionInsightPanel|GlobalActionPlanModal|AddStudentModal|AddStaffModal|React\.Fragment)(?:\s+[^>]*?)?\s*(/)?\s*>|</(div|main|Card|motion\.div|CardHeader|CardTitle|CardDescription|CardContent|AnimatePresence|Dialog|InterventionModal|StudentPredictionInsightPanel|GlobalActionPlanModal|AddStudentModal|AddStaffModal|React\.Fragment)>', content, re.DOTALL)
    
    stack = []
    
    # To get line numbers, we'll find the line number for each match
    line_starts = [0]
    for m in re.finditer(r'\n', content):
        line_starts.append(m.end())

    def get_line_num(pos):
        import bisect
        return bisect.bisect_right(line_starts, pos)

    for match in tags:
        pos = match.start()
        line_num = get_line_num(pos)
        
        is_closing = match.group(0).startswith('</')
        is_self_closing = match.group(2) == '/'
        
        if is_closing:
            tag_name = match.group(3)
            if not stack:
                print(f"Error: Unexpected closing tag </{tag_name}> at line {line_num}")
            else:
                last_tag, last_line = stack.pop()
                if last_tag != tag_name:
                    print(f"Error: Mismatched tag. Expected </{last_tag}> (from line {last_line}), found </{tag_name}> at line {line_num}")
        else:
            tag_name = match.group(1)
            if is_self_closing:
                continue
            stack.append((tag_name, line_num))
                
    for tag, line in stack:
        print(f"Error: Unclosed tag <{tag}> from line {line}")

if __name__ == "__main__":
    check_jsx(r'c:\Users\kharizma\Downloads\StudentAcademicPlatform-main\StudentAcademicPlatform-main\client\app\admin\page.tsx')
