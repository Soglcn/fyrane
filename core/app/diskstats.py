import psutil
from flask import Blueprint, jsonify

system_bp = Blueprint('system', __name__)

@system_bp.route('/api/system/disks', methods=['GET'])
def get_all_disks():
    disk_info = []

    partitions = psutil.disk_partitions(all=False)
    for p in partitions:
        try:
            usage = psutil.disk_usage(p.mountpoint)
            disk_info.append({
                "device": p.device,
                "mountpoint": p.mountpoint,
                "fstype": p.fstype,
                "total": usage.total,
                "used": usage.used,
                "free": usage.free
            })
        except PermissionError:
            continue  

    return jsonify(disk_info)

@system_bp.route('/api/system/disks/total', methods=['GET'])
def get_disk_totals():
    import psutil

    total = used = free = 0

    partitions = psutil.disk_partitions(all=False)
    seen = set()

    for p in partitions:
        if p.device in seen:
            continue  
        seen.add(p.device)

        try:
            usage = psutil.disk_usage(p.mountpoint)
            total += usage.total
            used += usage.used
            free += usage.free
        except PermissionError:
            continue

    return jsonify({
        "total": total,
        "used": used,
        "free": free
    })

