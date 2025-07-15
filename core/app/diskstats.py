import os
from flask import Blueprint, jsonify

system_bp = Blueprint('system', __name__)

MAX_DISK_CAPACITY_BYTES = 0.01 * 1024 ** 4  # 5 TB

def get_folder_size(path: str) -> int:
    total_size = 0
    if not os.path.exists(path):
        print(f"Uyarı: Klasör yolu mevcut değil: {path}")
        return 0
    
    for dirpath, dirnames, filenames in os.walk(path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            if not os.path.islink(fp):
                try:
                    total_size += os.path.getsize(fp)
                except OSError:
                    pass
    return total_size

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

fyrane_path = os.path.abspath(os.path.join(BASE_DIR, '..', '..'))

@system_bp.route('/api/system/disks', methods=['GET'])
def get_project_disks_usage():
    fyrane_folder_size = get_folder_size(fyrane_path)

    total_used = fyrane_folder_size
    total_free = MAX_DISK_CAPACITY_BYTES - total_used
    total_free = max(total_free, 0)

    return jsonify({
        "max_capacity_bytes": MAX_DISK_CAPACITY_BYTES,
        "used_bytes": total_used,
        "free_bytes": total_free
    })
